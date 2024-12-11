import React from 'react'
import {  FiSend } from 'react-icons/fi'
import { IoMdClose, } from 'react-icons/io'

const ChatArea = () => {
  return (
    <div>
      {/* component */}
      <div className="sm:p-2 justify-between flex flex-col h-screen">
        <div className="flex sm:items-center justify-between pb-2 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144" alt="" className="w-10 sm:w-14 h-10 sm:h-14 rounded-full" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">Anderson Vanhron</span>
              </div>
              <span className="text-lg text-gray-600">Junior Developer</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
              <IoMdClose size={24} />
            </button>
          </div>
        </div>
        <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          {/* Chat messages will go here */}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">

            <input type="text" placeholder="Message..." className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              
              <button type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                <span className="font-bold">Send</span>
                <FiSend size={24} className="ml-2 transform " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatArea
