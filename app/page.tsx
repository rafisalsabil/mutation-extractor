"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Steps } from "@/components/Steps";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { uploadAndExtract } from "@/lib/api";
import { Loader2 } from "lucide-react";

const STEPS = ["Uploading", "Extracting", "Validating", "Done"];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleExtract = async () => {
    if (!file) return;

    setStatus('processing');
    setErrorMessage('');

    try {
      // Step 1: Uploading
      setCurrentStep(0);
      await new Promise(r => setTimeout(r, 500));

      // Step 2: Extracting (API call)
      setCurrentStep(1);
      const result = await uploadAndExtract(file);

      // Step 3: Validating
      setCurrentStep(2);
      await new Promise(r => setTimeout(r, 300));

      // Step 4: Done
      setCurrentStep(3);
      setStatus('success');

      // Save to local storage
      localStorage.setItem('extractionResult', JSON.stringify(result));

      // Redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setStatus('error');
    }
  };


  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl border-border/60">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold">Upload Bank Mutation File</CardTitle>
            <p className="text-text-secondary mt-2">
              Upload your mutation statement (PDF, CSV, XLSX) to extract structured transactions.
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {status === 'processing' || status === 'success' ? (
              <div className="py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Steps currentStep={currentStep} steps={STEPS} />
                <div className="text-center space-y-2">
                  {status === 'processing' && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-medium">Processing your file...</span>
                    </div>
                  )}
                  {status === 'success' && (
                    <p className="text-success font-medium text-lg">Extraction Complete! Redirecting...</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <UploadDropzone onFileSelect={setFile} isExtracting={false} />

                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px]"
                    disabled={!file}
                    onClick={handleExtract}
                  >
                    Extract Mutation
                  </Button>
                  <button className="text-sm text-primary hover:underline hover:text-primary-hover font-medium">
                    Use sample file
                  </button>
                </div>
              </>
            )}

            {status === 'error' && (
              <div className="p-4 bg-error-bg text-error rounded-lg text-center text-sm space-y-2">
                <p className="font-medium">Something went wrong</p>
                <p>{errorMessage || 'Please try again.'}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setStatus('idle'); setCurrentStep(0); }}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
