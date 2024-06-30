---
title: 'Quickstart: Use Azure OpenAI Service with the JavaScript SDK and the completions API'
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the Go SDK.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 08/30/2023
---

[Source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai) | [Package (Go)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai)| [Samples](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#pkg-examples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
  Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- [Go 1.21.0](https://go.dev/dl/) or higher installed locally.
- An Azure OpenAI Service resource with the `gpt-35-turbo` model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Set up

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]

## Create a sample application

Create a new file named *chat_completions.go*. Copy the following code into the *chat_completions.go* file.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
)

func main() {
	azureOpenAIKey := os.Getenv("AOAI_CHAT_COMPLETIONS_API_KEY")
	modelDeploymentID := os.Getenv("AOAI_CHAT_COMPLETIONS_MODEL")

	// Ex: "https://<your-azure-openai-host>.openai.azure.com"
	azureOpenAIEndpoint := os.Getenv("AOAI_CHAT_COMPLETIONS_ENDPOINT")

	if azureOpenAIKey == "" || modelDeploymentID == "" || azureOpenAIEndpoint == "" {
		fmt.Fprintf(os.Stderr, "Skipping example, environment variables missing\n")
		return
	}

	keyCredential := azcore.NewKeyCredential(azureOpenAIKey)

	// In Azure OpenAI you must deploy a model before you can use it in your client. For more information
	// see here: https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource
	client, err := azopenai.NewClientWithKeyCredential(azureOpenAIEndpoint, keyCredential, nil)

	if err != nil {
		// TODO: Update the following line with your application specific error handling logic
		log.Printf("ERROR: %s", err)
		return
	}

	// This is a conversation in progress.
	// NOTE: all messages, regardless of role, count against token usage for this API.
	messages := []azopenai.ChatRequestMessageClassification{
		// You set the tone and rules of the conversation with a prompt as the system role.
		&azopenai.ChatRequestSystemMessage{Content: to.Ptr("You are a helpful assistant. You will talk like a pirate.")},

		// The user asks a question
		&azopenai.ChatRequestUserMessage{Content: azopenai.NewChatRequestUserMessageContent("Can you help me?")},

		// The reply would come back from the ChatGPT. You'd add it to the conversation so we can maintain context.
		&azopenai.ChatRequestAssistantMessage{Content: to.Ptr("Arrrr! Of course, me hearty! What can I do for ye?")},

		// The user answers the question based on the latest reply.
		&azopenai.ChatRequestUserMessage{Content: azopenai.NewChatRequestUserMessageContent("What's the best way to train a parrot?")},

		// from here you'd keep iterating, sending responses back from ChatGPT
	}

	gotReply := false

	resp, err := client.GetChatCompletions(context.TODO(), azopenai.ChatCompletionsOptions{
		// This is a conversation in progress.
		// NOTE: all messages count against token usage for this API.
		Messages:       messages,
		DeploymentName: &modelDeploymentID,
	}, nil)

	if err != nil {
		// TODO: Update the following line with your application specific error handling logic
		log.Printf("ERROR: %s", err)
		return
	}

	for _, choice := range resp.Choices {
		gotReply = true

		if choice.ContentFilterResults != nil {
			fmt.Fprintf(os.Stderr, "Content filter results\n")

			if choice.ContentFilterResults.Error != nil {
				fmt.Fprintf(os.Stderr, "  Error:%v\n", choice.ContentFilterResults.Error)
			}

			fmt.Fprintf(os.Stderr, "  Hate: sev: %v, filtered: %v\n", *choice.ContentFilterResults.Hate.Severity, *choice.ContentFilterResults.Hate.Filtered)
			fmt.Fprintf(os.Stderr, "  SelfHarm: sev: %v, filtered: %v\n", *choice.ContentFilterResults.SelfHarm.Severity, *choice.ContentFilterResults.SelfHarm.Filtered)
			fmt.Fprintf(os.Stderr, "  Sexual: sev: %v, filtered: %v\n", *choice.ContentFilterResults.Sexual.Severity, *choice.ContentFilterResults.Sexual.Filtered)
			fmt.Fprintf(os.Stderr, "  Violence: sev: %v, filtered: %v\n", *choice.ContentFilterResults.Violence.Severity, *choice.ContentFilterResults.Violence.Filtered)
		}

		if choice.Message != nil && choice.Message.Content != nil {
			fmt.Fprintf(os.Stderr, "Content[%d]: %s\n", *choice.Index, *choice.Message.Content)
		}

		if choice.FinishReason != nil {
			// this choice's conversation is complete.
			fmt.Fprintf(os.Stderr, "Finish reason[%d]: %s\n", *choice.Index, *choice.FinishReason)
		}
	}

	if gotReply {
		fmt.Fprintf(os.Stderr, "Got chat completions reply\n")
	}

}

```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

Now open a command prompt and run:

```cmd
go mod init chat_completions.go
```

Next run:

```cmd
go mod tidy
go run chat_completions.go
```

## Output

```output
Content[0]: Yes, many Azure AI services also support customer managed keys. These services enable you to bring your own encryption keys for data at rest, which provides you with more control over the security of your data.
```

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
