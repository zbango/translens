import classNames from "classnames";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
  onFileSelected: (file: File | null) => void;
}

export function FileUpload({ onFileSelected }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const { t } = useTranslation();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFileSelected(files[0]);
  };

  return (
    <div
      className={classNames(
        "gradient-border rounded-xl glass p-4 cursor-pointer transition",
        { "ring-2 ring-accent/60": dragging }
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-300">{t("upload.drop")}</p>
          <p className="text-xs text-slate-400">{t("upload.local")}</p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-accent text-slate-900 text-sm font-semibold">
          {t("upload.button")}
        </button>
      </div>
    </div>
  );
}
