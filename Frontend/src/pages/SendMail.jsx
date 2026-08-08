import '../App.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'

function SendMail() {

  const [file, setFile] = useState(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState(null)
  const [emails, setEmails] = useState([])

  const handelFile = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    const reader = new FileReader()

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result)
      const workbook = XLSX.read(data, { type: "array" })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      const emailList = rows
        .slice(1)
        .map(row => row[0])
        .filter(Boolean)

      setEmails(emailList)
      console.log("Extracted emails:", emailList)
    }

    reader.readAsArrayBuffer(selectedFile)
  }

  const handelSubject = (e) => setSubject(e.target.value)
  const handelMsg = (e) => setMessage(e.target.value)

  const handelSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setPopup({ success: false, text: "Please fill subject and message" })
      return
    }

    setLoading(true)
    setPopup(null)

    try {
      const res = await axios.post("https://bulkmail-b3o9.vercel.app/send", {
        subject: subject,
        message: message,
        emails: emails
      })

      if (res.data === "Success") {
        setPopup({ success: true, text: `Mail sent to ${emails.length} recipients!` })
      } else {
        setPopup({ success: false, text: "Failed to send mail" })
      }
    } catch (err) {
      console.log(err)
      setPopup({ success: false, text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />

      <div className="max-w-md mx-auto -mt-6 px-4 flex-1 w-full flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-0.5">
            Upload your recipient list
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Excel or CSV file with emails in column A
          </p>

          {/* File upload */}
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-4 cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs text-gray-600">
              {file ? file.name : "Click to upload or drag file here"}
            </span>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handelFile}
            />
          </label>

          {/* Subject input */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter mail subject"
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={handelSubject}
              value={subject}
            />
          </div>

          {/* Message textarea */}
          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              placeholder="Type your message here..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              onChange={handelMsg}
              value={message}
            />
          </div>

          <button
            onClick={handelSend}
            disabled={loading}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            {loading ? "Sending..." : "Send Bulk Mail"}
          </button>

          {/* Popup message */}
          {popup && (
            <div
              className={`mt-3 text-xs text-center rounded-lg py-1.5 px-3 ${
                popup.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {popup.text}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SendMail