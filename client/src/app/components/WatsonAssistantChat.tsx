"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    watsonAssistantChatOptions?: {
      integrationID: string;
      region: string;
      serviceInstanceID: string;
      clientVersion?: string;
      onLoad: (instance: { render: () => Promise<void> | void }) => void;
    };
  }
}

export default function WatsonAssistantChat() {
  useEffect(() => {
    if (document.getElementById("watson-assistant-chat-script")) return;

    window.watsonAssistantChatOptions = {
      integrationID: process.env.NEXT_PUBLIC_WATSONX_ASSISTANT_INTEGRATION_ID || "",
      region: process.env.NEXT_PUBLIC_WATSONX_ASSISTANT_REGION || "",
      serviceInstanceID:
        process.env.NEXT_PUBLIC_WATSONX_ASSISTANT_SERVICE_INSTANCE_ID || "",
      onLoad: async (instance) => {
        await instance.render();
      },
    };

    const script = document.createElement("script");
    script.id = "watson-assistant-chat-script";
    script.async = true;
    script.src = `https://web-chat.global.assistant.watson.appdomain.cloud/versions/${
      window.watsonAssistantChatOptions.clientVersion || "latest"
    }/WatsonAssistantChatEntry.js`;

    document.head.appendChild(script);
  }, []);

  return null;
}
