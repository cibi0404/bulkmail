import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://bulkmail-b3o9.vercel.app/login", {
        email,
        password
      })

      sessionStorage.setItem("token", res.data.token)
      sessionStorage.setItem("role", res.data.role)

      if (res.data.role === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/send")
      }
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-xl transition-colors"
        >
          Login
        </button>

        {error && (
          <p className="text-red-600 text-sm text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  )
}

export default Login