/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BotIcon,
  SchoolIcon,
  UserIcon,
  SendIcon,
  AddImageIcon,
} from "@/components/icons";
import { useChat } from "ai/react";
import { DragEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  return window.atob(base64);
};

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

export default function Home() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      onError: () =>
        toast.error("Su tarifa ha sido limitada, por favor inténtelo más tarde."),
    });

  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/")
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image and text files are allowed");
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUploadImg = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }
  return (
    <div
      className="flex flex-row justify-center h-dvh bg-white dark:bg-zinc-900"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 flex flex-row justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Arrastre y suelte los archivos aquí</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(images and text)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col justify-between gap-4">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2 h-full w-dvw items-center overflow-y-scroll">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0 ${index === 0 ? "pt-20" : ""
                  }`}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                  {message.role === "assistant" ? <BotIcon /> : <UserIcon />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                    <Markdown>{message.content}</Markdown>
                  </div>
                  <div className="flex flex-row gap-2">
                    {message.experimental_attachments?.map((attachment) =>
                      attachment.contentType?.startsWith("image") ? (
                        <img
                          className="rounded-md w-40 mb-3"
                          key={attachment.name}
                          src={attachment.url}
                          alt={attachment.name}
                        />
                      ) : attachment.contentType?.startsWith("text") ? (
                        <div className="text-xs w-40 h-24 overflow-hidden text-zinc-400 border p-2 rounded-md dark:bg-zinc-800 dark:border-zinc-700 mb-3">
                          {getTextFromDataUrl(attachment.url)}
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading &&
              messages[messages.length - 1].role !== "assistant" && (
                <div className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0">
                  <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                    <BotIcon />
                  </div>
                  <div className="flex flex-col gap-1 text-zinc-400">
                    <div>hmm...</div>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
              <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                <SchoolIcon />
              </p>
              <p>
                The useChat hook supports sending attachments along with
                messages as well as rendering previews on the client. This can
                be useful for building applications that involve sending images,
                files, and other media content to the AI provider.
              </p>
            </div>
          </motion.div>
        )}

        <form
          className="flex flex-col relative items-center pb-4"
          onSubmit={(event) => {
            const options = files ? { experimental_attachments: files } : {};
            handleSubmit(event, options);
            setFiles(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          <AnimatePresence>
            {files && files.length > 0 && (
              <div className="flex flex-row gap-2 mb-3 absolute bottom-12 px-4 w-full md:w-[500px] md:px-0">
                {Array.from(files).map((file) =>
                  file.type.startsWith("image") ? (
                    <div key={file.name}>
                      <motion.img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="rounded-md w-16"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                          y: -10,
                          scale: 1.1,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                      />
                    </div>
                  ) : file.type.startsWith("text") ? (
                    <motion.div
                      key={file.name}
                      className="text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{
                        y: -10,
                        scale: 1.1,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <TextFilePreview file={file} />
                    </motion.div>
                  ) : null
                )}
              </div>
            )}
          </AnimatePresence>
          <div className="messageBox">
            <div className="fileUploadWrapper">
              <label htmlFor="file">
                <AddImageIcon />
                <span className="tooltip">Adjunta una imagen</span>
              </label>
              <input type="file" id="file" name="file"
                onChange={event => {
                  if (event.target.files) {
                    setFiles(event.target.files);
                  }
                }}
                multiple
                ref={fileInputRef}
              />
              <input placeholder="Haz tu pregunta..." type="text" id="messageInput"
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onPaste={handlePaste}
              />
            </div>
            <button id="sendButton">
              <SendIcon />
            </button>
            <style>
              {`
              .messageBox {
                width: 340px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: #2d2d2d;
                padding: 0 15px;
                border-radius: 10px;
                border: 1px solid rgb(63, 63, 63);
              }
              .messageBox:focus-within {
                border: 1px solid rgb(110, 110, 110);
              }
              .fileUploadWrapper {
                width: fit-content;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, Helvetica, sans-serif;
              }

              #file {
                display: none;
              }
              .fileUploadWrapper label {
                cursor: pointer;
                width: fit-content;
                height: fit-content;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              }
              .fileUploadWrapper label svg {
                height: 18px;
              }
              .fileUploadWrapper label svg path {
                transition: all 0.3s;
              }
              .fileUploadWrapper label svg circle {
                transition: all 0.3s;
              }
              .fileUploadWrapper label:hover svg path {
                stroke: #fff;
              }
              .fileUploadWrapper label:hover svg circle {
                stroke: #fff;
                fill: #3c3c3c;
              }
              .fileUploadWrapper label:hover .tooltip {
                display: block;
                opacity: 1;
              }
              .tooltip {
                position: absolute;
                top: -40px;
                display: none;
                opacity: 0;
                color: white;
                font-size: 10px;
                text-wrap: nowrap;
                background-color: #000;
                padding: 6px 10px;
                border: 1px solid #3c3c3c;
                border-radius: 5px;
                box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.596);
                transition: all 0.3s;
              }
              #messageInput {
                width: 250px;
                height: 100%;
                background-color: transparent;
                outline: none;
                border: none;
                padding-left: 10px;
                color: white;
                text-align: left;
              }
              #messageInput:focus ~ #sendButton svg path,
              #messageInput:valid ~ #sendButton svg path {
                fill: #3c3c3c;
                stroke: white;
              }

              #sendButton {
                width: fit-content;
                height: 100%;
                background-color: transparent;
                outline: none;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
              }
              #sendButton svg {
                height: 18px;
                transition: all 0.3s;
              }
              #sendButton svg path {
                transition: all 0.3s;
              }
              #sendButton:hover svg path {
                fill: #3c3c3c;
                stroke: white;
              }

            `}
            </style>
          </div>
        </form>
      </div>
    </div>
  );
}
