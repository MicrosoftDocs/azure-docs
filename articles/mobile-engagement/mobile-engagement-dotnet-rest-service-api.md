<properties 
	pageTitle="Using the REST API to access Azure Mobile Engagement Service APIs" 
	description="Describes how to use the Mobile Engagement REST APIs to access Azure Mobile Engagement Service APIs"		
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="wesmc7777" 
	manager="erikre" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-multiple" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="07/07/2016" 
	ms.author="wesmc;ricksal" />

#Using REST to access Azure Mobile Engagement Service APIs

Azure Mobile Engagement provides the [Azure Mobile Engagement REST API](https://msdn.microsoft.com/library/azure/mt683754.aspx) for you to manage Devices, Reach/Push campaigns etc. This sample will use the REST APIs directly to create an Announcement campaign then activate and push it to a set of devices. 

If you do not want to use the REST APIs directly, we also provide a [Swagger file](https://github.com/Azure/azure-rest-api-specs/blob/master/arm-mobileengagement/2014-12-01/swagger/mobile-engagement.json) that you can use with tools to generate SDKs for your preferred language. We recommend using the [AutoRest](https://github.com/Azure/AutoRest) tool to generate your SDK from our Swagger file. We have created a .NET SDK in a similar manner which allows you to interact with these APIs using a C# wrapper and you don't have to do the authentication token negotiation and refresh yourself. If you want to walk through a similar sample using this wrapper, see [Service API .NET SDK Sample](mobile-engagement-dotnet-sdk-service-api.md)

This sample will use the REST APIs directly to create and activate an Announcement campaign. 

## Adding a user_name appInfo to the Mobile Engagement app

This sample will require an app-info tag added to the Mobile Engagement app. In the engagement portal for your app, you can add the tag by clicking **Settings** > **Tag (app-info)** > **New tag (app-info)**. Add the new tag named **user_name** as a **String** type.

![](./media/mobile-engagement-dotnet-rest-service-api/user-name-app-info.png)



If you followed [Getting Started with Azure Mobile Engagement for Windows Universal Apps](mobile-engagement-windows-store-dotnet-get-started.md), you can test sending the **user_name** tag by simply overriding `OnNavigatedTo()` in your `MainPage` class to send the app-info tag similar to the following code:

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);

        String name = "Wesley"; // Prompt the user to provide this in your client app.

        Dictionary<object, object> info = new Dictionary<object, object>();
        info.Add("user_name", name);
        EngagementAgent.Instance.SendAppInfo(info);
    }
 


## Creating the Service API app

1. First of all, you will need four authentication parameters to use with this sample. These parameters are **SubscriptionId**, **TenantId**, **ApplicationId** and **Secret**. To get these authentication parameters, it is recommended that you use the PowerShell script approach mentioned under the *One-time setup (using script)* section in the [Authentication](mobile-engagement-api-authentication.md#authentication) tutorial. 

2. We will use a simple Windows Console app to demonstrate working with the REST Service APIs to create and activate a new Announcement campaign. So open up Visual Studio and create a new **Console Application**.   

3. Next, add the **Newtonsoft.Json** NuGet package to your project.

4. In the `Program.cs` file, add the following `using` statements for the following namespaces:

		using System.IO;
		using System.Net;
		using Newtonsoft.Json.Linq;
		using Newtonsoft.Json;

5. Next you need to define the following constants in the `Program` class. These will be used for authentication and interacting with the Mobile Engagement App in which you are creating the Announcement campaign:


        // Parameters needed for authentication of API calls.
		// These are returned from the PowerShell script in the authentication tutorial. 
		// https://azure.microsoft.com/documentation/articles/mobile-engagement-api-authentication/
        static String SubscriptionId = "<Your Subscription Id>";
        static String TenantId = "<Your TenantId>";
        static String ApplicationId = "<Your Application Id>";
        static String Secret = "<Your Secret>";

		// The token for authenticating with your Mobile Engagement app.
        static String Token = null;

        // This is the Azure Resource group concept for grouping together resources 
        // See: https://azure.microsoft.com/en-us/documentation/articles/resource-group-portal/
        static String ResourceGroup = "MobileEngagement";

        // For Mobile Engagement operations
        // App Collection Name from the Azure portal 
        static String Collection = "<Your App Collection Name>";

        // Application Resource Name - make sure you are using the one as specified in the dashboard of the
		// Azure portal. (This is NOT the App Name)
        static String AppName = "WesmcRestTest-windows";

		// New campaign id returned from creating the new campaign and used to activate and push the campaign
		// a set of devices.
        static String NewCampaignID = null;

		// This list will hold the device Ids we choose to push the campaign to.
        static List<String> deviceList = new List<String>();


6. Add the following two methods to the `Program` class. These will be used to execute REST APIs and display responses to the console.

        private static async Task<HttpWebResponse> ExecuteREST(string httpMethod, string uri, string authToken, WebHeaderCollection headers = null, string body = null, string contentType = "application/json")
        {
            //=== Execute the request 
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(uri);
            HttpWebResponse response = null;

            request.Method = httpMethod;
            request.ContentType = contentType;
            request.ContentLength = 0;

            if (authToken != null)
                request.Headers.Add("Authorization", authToken);

            if (headers != null)
            {
                request.Headers.Add(headers);
            }

            if (body != null)
            {
                byte[] bytes = Encoding.UTF8.GetBytes(body);

                try
                {
                    request.ContentLength = bytes.Length;
                    Stream requestStream = request.GetRequestStream();
                    requestStream.Write(bytes, 0, bytes.Length);
                    requestStream.Close();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }

            try
            {
                response = (HttpWebResponse)await request.GetResponseAsync();
            }
            catch (WebException we)
            {
                if (we.Response != null)
                {
                    response = (HttpWebResponse)we.Response;
                }
                else
                    Console.WriteLine(we.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return response;
        }


        private static void DisplayResponse(dynamic data, HttpWebResponse response)
        {
            Console.WriteLine("HTTP Status " + (int)response.StatusCode + " : " + response.StatusDescription);
            Console.WriteLine(data + "\n");
        }

    }

7. Add the following code to your `Main` method to generate an authentication token with the authentication parameters you collected:

        //***************************************************************************
        //*** Get a valid authorization token with your authentication parameters ***
        //***************************************************************************

        String methodUrl = "https://login.microsoftonline.com/" + TenantId + "/oauth2/token";
        String requestBody = "grant_type=client_credentials&client_id=" + ApplicationId +
                            "&client_secret=" + Secret +
                            "&resource=https://management.core.windows.net/";
        Console.WriteLine("Getting authorization token...\n");
        HttpWebResponse response = ExecuteREST("POST", methodUrl, null, null, requestBody, null).Result;
        Stream receiveStream = response.GetResponseStream();
        StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8);
        dynamic data = JObject.Parse(readStream.ReadToEnd());
        readStream.Close();
        receiveStream.Close();
        DisplayResponse(data, response);

        if (response.StatusCode == HttpStatusCode.OK)
        {
            Token = data.token_type + " " + data.access_token;
            Console.WriteLine("Got authorization token...");
            Console.WriteLine("Authorization : " + Token + "\n");
        }
        else
        {
            Console.WriteLine("*** Failed to get authorization token. Check your parameters for API calls.\n");
            return;
        }

8. Now that we have a valid authentication token we can create a new Reach campaign using the [Create campaign](https://msdn.microsoft.com/library/azure/mt683742.aspx) REST API. The new campaign will be a simple **AnyTime** & **Notification-only** announcement campaign with a title and message. This will be a manual push campaign as shown in the following screen shot. This means it will only be pushed using the APIs.


	![](./media/mobile-engagement-dotnet-rest-service-api/manual-push.png)

	Add the following code to your `Main` method to create the announcement campaign: 

        //*****************************************************************************
        //*** Create a campaign to send a notification using the user-name app-info ***
        //*****************************************************************************

        String newCampaignMethodUrl = "https://management.azure.com/subscriptions/" + SubscriptionId + "/" +
               "resourcegroups/" + ResourceGroup + "/providers/Microsoft.MobileEngagement/appcollections/" +
               Collection + "/apps/" + AppName + "/campaigns/announcements?api-version=2014-12-01";

        String campaignRequestBody = "{ \"name\": \"BirthdayCoupon\", " +
                                        "\"type\": \"only_notif\", " +
                                        "\"deliveryTime\": \"any\", " +
                                        "\"notificationType\": \"popup\", " +
                                        "\"pushMode\":\"manual\", " +
                                        "\"notificationTitle\": \"Happy Birthday ${user_name}\", " +
                                        "\"notificationMessage\": \"Take extra 10% off on your orders today!\"}";

        Console.WriteLine("Creating new campaign...\n");
        HttpWebResponse newCampaignResponse = ExecuteREST("POST", newCampaignMethodUrl, Token, null, campaignRequestBody).Result;
        Stream receiveCampaignStream = newCampaignResponse.GetResponseStream();
        StreamReader readCampaignStream = new StreamReader(receiveCampaignStream, Encoding.UTF8);
        dynamic newCampaignData = JObject.Parse(readCampaignStream.ReadToEnd());
        readCampaignStream.Close();
        receiveCampaignStream.Close();
        DisplayResponse(newCampaignData, newCampaignResponse);

        if (newCampaignResponse.StatusCode == HttpStatusCode.Created)
        {
            NewCampaignID = newCampaignData.id;
            Console.WriteLine("Created new campaign...");
            Console.WriteLine("New Campaign Id    : " + NewCampaignID + "\n");
        }
        else
        {
            Console.WriteLine("*** Failed to create birthday campaign.\n");
            return;
        }


9. The campaign must be activated before it can be pushed to any devices. We saved the ID for the new campaign in the `NewCampaignID` variable. We will use this as a URI path parameter to activate the campaign using the [Activate campaign](https://msdn.microsoft.com/library/azure/mt683745.aspx) REST API. This should change the state of the campaign to **scheduled** even though it will only be pushed manually with the APIs.

	Add the following code to your `Main` method to activate the announcement campaign: 

        //******************************************
        //*** Activate the new birthday campaign ***
        //******************************************

        String activateCampaignUrl = "https://management.azure.com/subscriptions/" + SubscriptionId + "/" +
                  "resourcegroups/" + ResourceGroup + "/providers/Microsoft.MobileEngagement/appcollections/" +
                   Collection + "/apps/" + AppName + "/campaigns/announcements/" + NewCampaignID +
                   "/activate?api-version=2014-12-01";

        Console.WriteLine("Activating new campaign (ID : " + NewCampaignID + ")...\n");
        HttpWebResponse activateCampaignResponse = ExecuteREST("POST", activateCampaignUrl, Token).Result;
        Stream activateCampaignStream = activateCampaignResponse.GetResponseStream();
        StreamReader activateCampaignReader = new StreamReader(activateCampaignStream, Encoding.UTF8);
        dynamic activateCampaignData = JObject.Parse(activateCampaignReader.ReadToEnd());
        activateCampaignReader.Close();
        activateCampaignStream.Close();
        DisplayResponse(activateCampaignData, activateCampaignResponse);

        if (activateCampaignResponse.StatusCode == HttpStatusCode.OK)
        {
            Console.WriteLine("Activated new campaign...");
            Console.WriteLine("New Campaign State : " + activateCampaignData.state + "\n");
        }
        else
        {
            Console.WriteLine("*** Failed to activate birthday campaign.\n");
            return;
        }

10. To push the campaign we need to provide the device Ids for the users that we want to receive the notification. We will use the [Query devices](https://msdn.microsoft.com/library/azure/mt683826.aspx) REST API to get all device Ids. We will add each device Id to the list if it has associated **user_name** appInfo.

	Add the following code to your `Main` method to get all device Ids and populate the deviceList:

        //************************************************************************
        //*** Now that the manualPush campaign is activated, get the deviceIds ***
        //*** that you want to trigger the push campaign on.                   ***
        //************************************************************************

        String getDevicesUrl = "https://management.azure.com/subscriptions/" + SubscriptionId + "/" +
                  "resourcegroups/" + ResourceGroup + "/providers/Microsoft.MobileEngagement/appcollections/" +
                   Collection + "/apps/" + AppName + "/devices?api-version=2014-12-01";

        Console.WriteLine("Getting device IDs...\n");
        HttpWebResponse devicesResponse = ExecuteREST("GET", getDevicesUrl, Token).Result;
        Stream devicesStream = devicesResponse.GetResponseStream();
        StreamReader devicesReader = new StreamReader(devicesStream, Encoding.UTF8);
        dynamic devicesData = JObject.Parse(devicesReader.ReadToEnd());
        devicesReader.Close();
        devicesStream.Close();
        DisplayResponse(devicesData, devicesResponse);

        if (devicesResponse.StatusCode == HttpStatusCode.OK)
        {
            Console.WriteLine("Got devices.");
            foreach (dynamic device in devicesData.value)
            {
                // Just adding all in this example
                if (device.appInfo.user_name != null)
                {
                    Console.WriteLine("Adding device for push campaign...");
                    Console.WriteLine("Device ID    : " + device.deviceId);
                    Console.WriteLine("user_name    : " + device.appInfo.user_name);
                    deviceList.Add((String)device.deviceId);
                }
            }
            Console.WriteLine();
        }
        else
        {
            Console.WriteLine("*** Failed to get devices.\n");
			return;
        }


11. Lastly, we will push the campaign to all device Ids in our list using the [Push campaign](https://msdn.microsoft.com/library/azure/mt683734.aspx) REST API. This is an **in-app** notification. So the app will have to be running on the device in order for it to be received by the user.

	Add the following code to your `Main` method to push the campign to the devices in the deviceList:

        //**************************************************************
        //*** Trigger the manualPush campaign on the desired devices ***
        //**************************************************************

        String pushCampaignUrl = "https://management.azure.com/subscriptions/" + SubscriptionId + "/" +
                  "resourcegroups/" + ResourceGroup + "/providers/Microsoft.MobileEngagement/appcollections/" +
                   Collection + "/apps/" + AppName + "/campaigns/announcements/" + NewCampaignID + 
                   "/push?api-version=2014-12-01";

        Console.WriteLine("Triggering push for new campaign (ID : " + NewCampaignID + ")...\n");
        String deviceIds = "{\"deviceIds\":" + JsonConvert.SerializeObject(deviceList) + "}";
        Console.WriteLine("\n" + deviceIds + "\n");
        HttpWebResponse pushDevicesResponse = ExecuteREST("POST", pushCampaignUrl, Token, null, deviceIds).Result;
        Stream pushDevicesStream = pushDevicesResponse.GetResponseStream();
        StreamReader pushDevicesReader = new StreamReader(pushDevicesStream, Encoding.UTF8);
        dynamic pushDevicesData = JObject.Parse(pushDevicesReader.ReadToEnd());
        pushDevicesReader.Close();
        pushDevicesStream.Close();
        DisplayResponse(pushDevicesData, pushDevicesResponse);

        if (pushDevicesResponse.StatusCode == HttpStatusCode.OK)
        {
            Console.WriteLine("Triggered push on new campaign.\n");
        }
        else
        {
            Console.WriteLine("*** Failed to push campaign to the device list.\n");
        }


12. Build and run your console app. Your output should be similar to the following:


		C:\Users\Wesley\AzME_Service_API_Rest\test.exe

		Getting authorization token...
		
		HTTP Status 200 : OK
		{
		  "token_type": "Bearer",
		  "expires_in": "3599",
		  "expires_on": "1458085162",
		  "not_before": "1458081262",
		  "resource": "https://management.core.windows.net/",
		  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPW
		b3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFh
		NzE4LTQ0YzQtOGVjMS0xM2IwODExMTRmM2UiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53
		MTdhNGJkIiwic3ViIjoiOWIzZGQ2MDctNmYwOC00Y2Y5LTk2N2YtZmUyOGU3MTdhNGJkIiwidGlkIjoiNzJm
		F5x9gj8JJ4CjtLaH3mm1_U22Qc_AjB9mtbM97dgu3kCiUm19ISatRBoAmVz3JGW6LSv2TyCeg9TGYVrE3OAE
		hl_pY9COXicc7I501_X67GsmUgs9-EedF3STrEoY5cONTiMvwCLfeBgScgXA0ikAu62KpzMu0VFDYu-HASI8
		}
		
		Got authorization token...
		Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNN
		aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYt
		Zi1jNzE4LTQ0YzQtOGVjMS0xM2IwODExMTRmM2UiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0
		OGU3MTdhNGJkIiwic3ViIjoiOWIzZGQ2MDctNmYwOC00Y2Y5LTk2N2YtZmUyOGU3MTdhNGJkIiwidGlkIjoi
		iI-oF5x9gj8JJ4CjtLaH3mm1_U22Qc_AjB9mtbM97dgu3kCiUm19ISatRBoAmVz3JGW6LSv2TyCeg9TGYVrE
		vsf3hl_pY9COXicc7I501_X67GsmUgs9-EedF3STrEoY5cONTiMvwCLfeBgScgXA0ikAu62KpzMu0VFDYu-H
		
		Creating new campaign...
		
		HTTP Status 201 : Created
		{
		  "id": 24,
		  "state": "draft"
		}
		
		Created new campaign...
		New Campaign Id    : 24
		
		Activating new campaign (ID : 24)...
		
		HTTP Status 200 : OK
		{
		  "id": 24,
		  "state": "scheduled"
		}
		
		Activated new campaign...
		New Campaign State : scheduled
		
		Getting device IDs...
		
		HTTP Status 200 : OK
		{
		  "value": [
		    {
		      "meta": {
		        "lastSeen": 1458080534371,
		        "firstSeen": 1458080534371,
		        "lastLocation": 1458081389617,
		        "lastInfo": 1458080571603
		      },
		      "appInfo": {
		        "user_name": "Wesley"
		      },
		      "deviceId": "1d6208b8f281203ecb49431e2e5ce6b3"
		    },
		    {
		      "meta": {
		        "lastSeen": 1457990584698,
		        "firstSeen": 1457949384025,
		        "lastLocation": 1457990914895,
		        "lastInfo": 1457990584597
		      },
		      "appInfo": {
		        "user_name": "Wesley"
		      },
		      "deviceId": "302486644890e26045884ee5aa0619ec"
		    }
		  ]
		}
		
		Got devices.
		Adding device for push campaign...
		Device ID    : 1d6208b8f281203ecb49431e2e5ce6b3
		user_name    : Wesley
		Adding device for push campaign...
		Device ID    : 302486644890e26045884ee5aa0619ec
		user_name    : Wesley
		
		Triggering push for new campaign (ID : 24)...
		
		
		{"deviceIds":["1d6208b8f281203ecb49431e2e5ce6b3","302486644890e26045884ee5aa0619ec"]}
		
		HTTP Status 200 : OK
		{
		  "invalidDeviceIds": []
		}
		
		Triggered push on new campaign.
		


<!-- Images. -->

[1]: ./media/mobile-engagement-dotnet-sdk-service-api/include-prerelease.png
