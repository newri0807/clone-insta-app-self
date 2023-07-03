/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import useSWR from "swr";
import Avatar from "../components/Avartar";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
function Page() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const { data, error, isLoading } = useSWR("/api/me");

  console.log(data);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file || null);
  };

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("text", text);
      formData.append("userId", data._id);

      const response = await fetch("/api/post/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Post uploaded successfully");
        // 다른 처리나 업데이트 로직을 추가할 수 있음
        setFile(null);
        setFileNames([]);
        setText("");
      } else {
        console.error("Failed to upload post");
      }
    } catch (error) {
      console.error("Error occurred while uploading post:", error);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      acceptedFiles = acceptedFiles.slice(0, 1); // Keep only the first file
      setFileNames([]);
      setFile(null);
      alert("Only one file is allowed. The first file has been selected.");
      return;
    }
    setFileNames(acceptedFiles.map((file) => file.name));
    setFile(acceptedFiles[0] || null);
  };

  return (
    <>
      <section className="flex justify-center my-2 gap-2 items-center">
        <Avatar img={data?.image} active={true} size="small" />
        <p className="text-center">{data?.username}</p>
      </section>

      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <div className="mb-4">
          {/* <label
            htmlFor="file"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Upload File:
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            key={file && `file`}
            onChange={handleFileChange}
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 border rounded-md shadow-sm"
          /> */}

          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps({
                  className: `dropzone ${isDragActive ? "drag-active" : ""}`,
                })}
              >
                <input {...getInputProps()} />
                {fileNames.length > 0 ? (
                  <div className="w-full">
                    <strong>Files:</strong>
                    <ul>
                      {fileNames.map((fileName) => (
                        <li key={fileName}>{fileName}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>Drag drop files, or click to select files</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>
        <div className="mb-4">
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Text:
          </label>
          <textarea
            id="text"
            value={text}
            placeholder="Write caption..."
            onChange={handleTextChange}
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 border rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default Page;
