import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

export default function FileUpload({ file, setFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? 'border-getdevmid bg-blue-50' : 'border-gray-300 hover:border-getdevmid hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center space-x-3 text-getdevdark">
            <File className="w-8 h-8" />
            <div className="text-left">
              <p className="font-medium truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 space-y-2">
            <Upload className="w-8 h-8 mb-2" />
            <p className="font-medium text-center">Drag & drop your CV here</p>
            <p className="text-sm">or click to browse</p>
            <p className="text-xs mt-2 text-gray-400">PDF only (max. 5MB)</p>
          </div>
        )}
      </div>
      {file && (
        <button 
          onClick={() => setFile(null)} 
          className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Remove file
        </button>
      )}
    </div>
  );
}
