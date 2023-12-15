---
#services: cognitive-services
manager: nitinme
author: travisw
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/29/2023
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]

## Create a Go environment

1. Create a new folder named *openai-go* for your project and a new Go code file named *sample.go*. Change into that directory:

   ```cmd
   mkdir openai-go
   cd openai-go
   ```

1. Install the following Go packages:

   ```cmd
   go get github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai
   ```
1. Enable dependency tracking for your code.
    ```cmd
    go mod init example/azure-openai
    ```
## Create the Go app

1. From the project directory, open the *sample.go* file and add the following code:

   ```golang
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
   
   	azureOpenAIKey := os.Getenv("AOAIKey")
   	modelDeploymentID := os.Getenv("AOAIDeploymentId")
   
   	// Ex: "https://<your-azure-openai-host>.openai.azure.com"
   	azureOpenAIEndpoint := os.Getenv("AOAIEndpoint")
   
   	// Azure AI Search configuration
   	searchIndex := os.Getenv("SearchIndex")
   	searchEndpoint := os.Getenv("SearchEndpoint")
   	searchAPIKey := os.Getenv("SearchKey")
   
   	if azureOpenAIKey == "" || modelDeploymentID == "" || azureOpenAIEndpoint == "" || searchIndex == "" || searchEndpoint == "" || searchAPIKey == "" {
   		fmt.Fprintf(os.Stderr, "Skipping example, environment variables missing\n")
   		return
   	}
   
   	keyCredential := azcore.NewKeyCredential(azureOpenAIKey)
   
   	// In Azure OpenAI you must deploy a model before you can use it in your client. For more information
   	// see here: https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource
   	client, err := azopenai.NewClientWithKeyCredential(azureOpenAIEndpoint, keyCredential, nil)
   
   	if err != nil {
   		//  TODO: Update the following line with your application specific error handling logic
   		log.Fatalf("ERROR: %s", err)
   	}
   	inScope := true
   	semanticConfiguration := "default"
   
   	resp, err := client.GetChatCompletions(context.TODO(), azopenai.ChatCompletionsOptions{
   		Messages: []azopenai.ChatRequestMessageClassification{
   			&azopenai.ChatRequestUserMessage{
   				Content: azopenai.NewChatRequestUserMessageContent("What are the differences between Azure Machine Learning and Azure AI services?"),
   			},
   		},
   		MaxTokens: to.Ptr[int32](512),
   		AzureExtensionsOptions: []azopenai.AzureChatExtensionConfigurationClassification{
   			&azopenai.AzureCognitiveSearchChatExtensionConfiguration{
   				// This allows Azure OpenAI to use an Azure AI Search index.
   				//
   				// > Because the model has access to, and can reference specific sources to support its responses, answers are not only based on its pretrained knowledge
   				// > but also on the latest information available in the designated data source. This grounding data also helps the model avoid generating responses
   				// > based on outdated or incorrect information.
   				//
   				// Quote from here: https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data
   				Parameters: &azopenai.AzureCognitiveSearchChatExtensionParameters{
   					Endpoint:  &searchEndpoint,
   					IndexName: &searchIndex,
   					Authentication: &azopenai.OnYourDataAPIKeyAuthenticationOptions{
   						Key: &searchAPIKey,
   					},
   					InScope:               &inScope,
   					SemanticConfiguration: &semanticConfiguration,
   				},
   			},
   		},
   		DeploymentName: &modelDeploymentID,
   	}, nil)
   
   	if err != nil {
   		//  TODO: Update the following line with your application specific error handling logic
   		log.Fatalf("ERROR: %s", err)
   	}
   
   	// Contains contextual information from your Azure chat completion extensions, configured above in `AzureExtensionsOptions`
   	msgContext := resp.Choices[0].Message.Context
   
   	fmt.Fprintf(os.Stderr, "Extensions Context Role: %s\nExtensions Context (length): %d\n",
   		*msgContext.Messages[0].Role,
   		len(*msgContext.Messages[0].Content))
   
   	fmt.Fprintf(os.Stderr, "ChatRole: %s\nChat content: %s\n",
   		*resp.Choices[0].Message.Role,
   		*resp.Choices[0].Message.Content,
   	)
   }
   ```

   > [!IMPORTANT]
   > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

1. Execute the following command:

   ```cmd
   go run sample.go
   ```

   The application prints the response including both answers to your query and citations from your uploaded files.

> [!div class="nextstepaction"]
> [I ran into an issue when running the code samples.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=dotnet&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-dotnet-application)
