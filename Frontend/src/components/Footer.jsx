function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 text-xs">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Bulk Mail. Built by Cibi.</span>
          <a href="mailto:parthasarathi0404@gmail.com" className="text-red-400 hover:text-red-300">
            parthasarathi0404@gmail.com
          </a>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Mail server online
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer