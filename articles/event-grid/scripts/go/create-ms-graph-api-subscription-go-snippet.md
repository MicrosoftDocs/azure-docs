import (
	  "context"
	  "time"
	  msgraphsdk "github.com/microsoftgraph/msgraph-sdk-go"
	  graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
	  //other-imports
)

graphClient := msgraphsdk.NewGraphServiceClientWithCredentials(cred, scopes)


requestBody := graphmodels.NewSubscription()
changeType := "updated,deleted,created"
requestBody.SetChangeType(&changeType) 
notificationUrl := "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic"
requestBody.SetNotificationUrl(&notificationUrl)
lifecycleNotificationUrl := "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic"
requestBody.SetLifecycleNotificationUrl(&lifecycleNotificationUrl)
resource := "users"
requestBody.SetResource(&resource) 
expirationDateTime , err := time.Parse(time.RFC3339, "2024-03-31T18:23:45.9356913Z")
requestBody.SetExpirationDateTime(&expirationDateTime) 
clientState := "secretClientValue"
requestBody.SetClientState(&clientState) 

subscriptions, err := graphClient.Subscriptions().Post(context.Background(), requestBody, nil)