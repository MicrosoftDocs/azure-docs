---
title: Use a Microsoft Sentinel watchlist and playbook to inform owners of alerts
description: Learn how to create a Microsoft Sentinel watchlist and playbook based on a Microsoft Defender for Cloud incident creation rule to inform resource owners of security alerts.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 09/20/2021
---

# Use Microsoft Sentinel watchlists and playbooks together to automate activity

This article describes two, common situations where using watchlists and playbooks together are helpful in automating activity in your systems: informing resource owners about alerts and responding to incidents with deny and allow lists.

## Automatically inform owners of alerts

[Microsoft Defender for Cloud alerts](/azure/defender-for-cloud/defender-for-cloud-introduction) inform the Security Operations Center (SOC) about possible security attacks on Azure resources.

If the SOC doesn't have access permissions to a potentially compromised resource, they need to contact the resource owner during alert investigation to find out whether they're familiar with the detected activity in their resource and ask them to take mitigation steps on their resource.

Rather than manually finding the relevant contact and reaching out to them each time a new alert occurs, this article shows how you can use Microsoft Sentinel watchlists and a playbook to make that contact automatically. For the sake of simplicity, this article uses the subscription owner level, but you can implement this solution for any specified resource owner.

> [!NOTE]
> The playbook described in this article uses the [Microsoft Sentinel incident trigger](/connectors/azuresentinel/#triggers). You can implement a similar solution by creating scheduled alerts with Microsoft Defender for Cloud, and then using the alert trigger.
>

### Prerequisites

To use the process described in this section, you must have the following prerequisites:

- A user or registered application with [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role to use with the Microsoft Sentinel connector to Azure Logic Apps

- The [Defender for Cloud data connector](connect-azure-security-center.md) and [incident creation rule](automate-incident-handling-with-automation-rules.md#creating-and-managing-automation-rules) enabled

- A user to authenticate to Microsoft Teams, and a user to authenticate to Office 365 Outlook

### Process summary and playbook steps

The process described in this section includes the following steps:

1. A Microsoft Sentinel watchlist maps each subscription in the organization to its owner and their contact email address.

1. The **Watchlists-InformSubowner-IncidentTrigger** playbook is attached to a Defender for Cloud incident creation rule.

   Every new instance of the Defender for Cloud alert that flows to Microsoft Sentinel creates a Microsoft Sentinel incident.

1. The playbook then triggers, receiving the incident with the contained alert as input.

1. The playbook queries the watchlist and finds the relevant resource's subscription owner details.

1. The playbook sends the subscription owner a Teams message and email with details about the potential resource compromise.


The following image shows the **Watchlists-InformSubowner-IncidentTrigger** playbook in the Logic App designer.

![Image of the Watchlists-InformSubowner-IncidentTrigger playbook.](media/inform-owner-playbook/playbook.png)

The playbook runs the following steps:

1. **When Microsoft Sentinel incident creation rule was triggered**, the playbook receives the created incident as input.

1. **For each alert** in the incident, typically one alert, the playbook runs the following steps:

   1. **Filter array to get AzureResource identifier**. A Microsoft Defender for Cloud alert might have two kinds of identifiers: `AzureResource` or a resource ID shown in Log Analytics, and Log Analytics information about the workspace that stores the alerts. This action returns an array of just the `AzureResource` identifiers for later use.

   1. **Parse Json to get subscriptionId**. This step gets the Subscription ID from the *SecAdditional Data* of the Defender for Cloud alert.

   1. **Run query and list results - Get Watchlist**. The Azure Monitor Log Analytics connector gets the watchlist items, including the **Subscription**, **Resource Group**, and **Resource Name** for the Microsoft Sentinel workspace details where the watchlist is located. Use the `project` argument to specify which fields are relevant for your use.

      ![Image of the Run query and list results playbook task.](media/inform-owner-playbook/run-query.png)

   1. **Filter array to get relevant subscription owners**. This step keeps the watchlist results only for the subscription you're looking for. The Logic Apps expression argument on the right is:

      `string(body('Parse_JSON_to_get_subscriptionId')?['properties']?['effectiveSubscriptionId'])`

      ![Image that shows the filter array playbook task.](media/inform-owner-playbook/filter-array.png)

   1. **Post a message as the flow bot to a user**. This step sends a message to the subscription owner in Microsoft Teams with any details you want to share about the new alert.

      ![Image that shows creating the Teams message in the playbook step.](media/inform-owner-playbook/create-message.png)

   1. **Send an Email**. This step sends a message to the subscription owner in Outlook with any details you want to share about the new alert.

      ![Image that shows creating the email message in the playbook step.](media/inform-owner-playbook/create-email.png)

### Set up your watchlist and deploy the playbook

Use the following steps to create and upload the watchlist, deploy the playbook, and then confirm your API connections.

**To create and upload the watchlist:**

1. Create an input comma-separated value (CSV) file with the following columns: **SubscriptionId**, **SubscriptionName**, **OwnerName**, **OwnerEmail**, where each row represents a subscription in an Azure tenant. For example:

   ```csv
   SubscriptionId,SubscriptionName,OwnerName,OwnerEmail
   00000000-0000-0000-0000-000000000001,DemoSubscription1,Megan Bowen,mbowen@contoso.com
   00000000-0000-0000-0000-000000000002,DemoSubscription2,MOD Admin,MODadmin@contoso.com
   ```

1. Upload the table to the Microsoft Sentinel **Watchlist** area. Make a note of the value you use as the **Watchlist Alias**, as you'll use it to query this watchlist from the playbook.

    For more information, see [Use Microsoft Sentinel watchlists](watchlists.md).

**To deploy the playbook**:

1. In the Microsoft Sentinel **Automation** page, on the **Playbook templates (Preview)** tab, search for and locate the **Watchlists-InformSubowner-IncidentTrigger** playbook.

1. On the bottom right, select **Create playbook**, and then use the wizard to deploy the playbook in your workspace.

    Make sure to enter a meaningful name for your playbook, and a **User name** to determine the names of the API connection resources.

1. After the deployment is complete, select your new playbook to open it in the Logic Apps Designer.

1. In your logic app, on the left under **Development Tools**, select **API connections**, and select the connection for each product in the playbook.

    For any unconnected products, select **Authorize**, sign in, and then save the logic app.

## Automate incident response with an allow list

Allow-listing is a helpful strategy for allowing certain identities or sources to access sensitive resources or exclude them from security protections. For example, if a specific IP address on an allow list triggers a new alert, your system can use an allow list to recognize it as known to the SOC as an approved source. If an alert includes only approved IP addresses in its entities, you can save time by automatically closing the incident.

This section describes how to use a watchlist and a playbook to automatically close incidents for approved IP addresses, as an example of how this strategy works.

> [!TIP]
> You can add more steps to the playbook described in this section, or modify it for similar steps in deny list scenarios.

### Prerequisites

To use the process described in this section, you must have a user or registered application with [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role to use with the Microsoft Sentinel connector to Azure Logic Apps.

## Process summary and playbook steps

The process described in this article includes the following steps:

1. A Microsoft Sentinel watchlist lists all approved IP addresses.

1. The **Watchlist-CloseIncidentKnownIPs** playbook is attached to an analytics rule that attaches IP addresses to the outcome alerts.

   1. Each time a new alert for the analytics rule is created, the playbook is triggered and obtains the alert details.

   1.  For each IP address in the collected alert, the playbook queries the watchlist to verify whether they are approved.

   1.  Any IP address found in the watchlist is added to the *Safe IPs* array. IP addresses not found in the watchlist are added to the *Not Safe IPs* array.

   1. An informative comment is added to the incident that contains the alert, adding details about the IP addresses in each category (*Safe*/*Not Safe*).

1. If all listed IP addresses are safe, the incident is closed with a **Benign Positive** classification reason.


The following image shows the **Watchlists-CloseIncidentKnownIPs** playbook in the Logic App designer.

![Image of the Watchlists-CloseIncidentKnownIPs playbook.](media/inform-owner-playbook/playbook-close-incidents.png)

The playbook runs the following steps:

1.  When a response to an Azure Sentinel alert is triggered

Azure Sentinel alert was created. The playbook receives the alert as the input.

 

Initialize variables

This actions stores values to be used later in the playbook:

Watchlist name is a variable of type string, will be used for the Log Analytics query 
Safe/not safe IPs are variables of type array, will be used to store the found IPs
 

Entities - Get IPs

This action takes all the entities found in the alert and parses only the IPs with their special fields ready to be used as dynamic values in later actions.

 

For Each IP

Iterates on the IPs found in this alert and performs the following:

thumbnail image 2 of blog post titled 
	
	
	 
	
	
	
				
		
			
				
						
							Playbooks & Watchlists Part 2:  Automate incident response for Deny-list/Allow-list
							
						
					
			
		
	
			
	
	
	
	
	
 

Run query and list results - Get Watchlist
In this step we ask Log Analytics (Azure Monitor Logs connector) to get the items of the Watchlist. Subscription, Resource Group and Resource Name are the Azure Sentinel workspace details where the watchlist is located.
I used the following query:
_GetWatchlist(@{variables('WatchlistName')})
| extend IpAddress = tostring(parse_json(WatchlistItem).IpAddress)
| where IpAddress == ''@{items('For_each')?['Address']}"
Condition
In this step I check the length of the response array from the query, using the Logic apps expression length(collection). If it is greater then 0, we have found the IP in the watchlist.
Therefor, we will add this IP to the Safe array; otherwise, to the not safe.
 

Add a comment to the incident
In this step we audit the information collected so far: a list of safe IPs found in the Watchlist, a side to a list of unknown IPs.

 

Condition

Finally, we want to check if there is any IP which found as not safe. This step checks if our "not safe" array is empty. If so, we will close the incident.

 

Change Incident Status
Closes the incident with Benign Positive classification reason.

Setup instructions
 

Create and Upload your watchlist

 

Create your input CSV table
In this use case I have created a simple table, where each row represents an ip address.
I created the table using Office 365 Excel, and then saved it as a CSV file (save as).

Upload your table

In Azure Sentinel, go to Watchlists.

Click on Add new
thumbnail image 3 of blog post titled 
	
	
	 
	
	
	
				
		
			
				
						
							Playbooks & Watchlists Part 2:  Automate incident response for Deny-list/Allow-list
							
						
					
			
		
	
			
	
	
	
	
	


Fill in the required details.
Note that the Alias will be used to query this watchlist in the playbook query step.

Add the CSV file

Review and create.
 
Playbook deployment instructions
 

Open the link to the playbook.  Scroll down on the page and Click on “Deploy to Azure” or "Deploy to Azure Gov" button depending on your need.
       
Fill the parameters:
 
Basics
Fill the subscription, resource group and location Sentinel workspace is under.
Settings
Playbook name - this is how you'll find the playbook in your subscription
User name (will affect the names of the API connections resources)
Check the terms and conditions and click purchase.
The ARM template, contains the Logic App workflow (playbook) and API connections is now deploying to Azure. When finished, you will be taken to the Azure ARM Template summary page.
Click on the Logic Apps name. you will be taken to the Logic Apps resource of this playbook.
Confirm API connections
On the left menu, click on API connections.
For each product being used in this playbook, click on the connection name - in our case, it is only the Azure Sentinel connection.
Click on Authorize to log in with your user, and don't forget to save.
## Next steps

- [Microsoft Sentinel Logic Apps connector](/connectors/azuresentinel)
- [Microsoft Teams Logic Apps connector](/connectors/teams/)
- [Office 365 Outlook Logic Apps connector](/connectors/office365)
- [Create incidents from alerts in Microsoft Sentinel](create-incidents-from-alerts.md)
- [Watchlists-InformSubowner-IncidentTrigger playbook](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Watchlist-InformSubowner-IncidentTrigger) in the Microsoft Sentinel Playbooks repository

