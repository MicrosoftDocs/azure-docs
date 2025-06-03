---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/07/2025
ms.author: cephalin
ms.custom:
  - build-2025
---

With the application fully deployed and configured, you can now test the RAG functionality:

1. Open the application URL provided at the end of the deployment.

2. You see a chat interface where you can enter questions about the content of your uploaded documents.

   :::image type="content" source="../../media/tutorial-ai-openai-search-dotnet/chat-interface.png" alt-text="Screenshot showing the Blazor chat interface.":::

3. Try asking questions that are specific to the content of your documents. For example, if you uploaded the documents in the *sample-docs* folder, you can try out these questions:

    - How does Contoso use my personal data?
    - How do you file a warranty claim?
    
4. Notice how the responses include citations that reference the source documents. These citations help users verify the accuracy of the information and find more details in the source material.

   :::image type="content" source="../../media/tutorial-ai-openai-search-dotnet/citations.png" alt-text="Screenshot showing a response with citations to source documents.":::

5. Test the hybrid search capabilities by asking questions that might benefit from different search approaches:

   - Questions with specific terminology (good for keyword search).
   - Questions about concepts that might be described using different terms (good for vector search).
   - Complex questions that require understanding context (good for semantic ranking).
