"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface UploadDropzoneProps {
    onFileSelect: (file: File) => void;
    isExtracting?: boolean;
}

export function UploadDropzone({ onFileSelect, isExtracting }: UploadDropzoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);
        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-4">
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full min-h-[280px] rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden",
                    dragActive
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50",
                    selectedFile && "border-green-200 bg-green-50/30"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !selectedFile && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".csv,.pdf,.xlsx"
                    onChange={handleChange}
                    disabled={isExtracting}
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                            <FileText className="h-10 w-10 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-text-primary px-4 text-center break-all">{selectedFile.name}</p>
                        <p className="text-sm text-text-secondary mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>

                        {!isExtracting && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-4 text-error hover:text-red-700 hover:bg-red-50 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                            >
                                Remove File
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center p-8">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <UploadCloud className="h-10 w-10 text-primary/80" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                            Click to upload or drag and drop
                        </h3>
                        <p className="text-sm text-text-secondary max-w-xs mx-auto">
                            PDF, CSV or Excel files. Max file size 10MB.
                        </p>
                        <div className="mt-8">
                            <span className="text-xs font-medium text-text-secondary bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                Secure & Private Processing
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
