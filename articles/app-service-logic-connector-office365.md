<properties 
   pageTitle="Office 365 Connector" 
   description="How to use the Office 365 Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="sutalasi" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="sutalasi"/>


#Using the Office 365 Connector in your Logic App#

Logic apps can trigger based on a variety of data sources and offer connectors to get and process data as a part of the flow. Office 365 Connector lets you send and receive emails, manage calendar and contacts in your Office 365 account. You can perform various actions such as send, receive and get emails, create and delete events in your calendar and create, update, get and delete your contacts.

**Basic Actions**

- New Mail (Trigger)
- Send Mail
- Reply To Mail
- Send Event
- Add Contact

##Create the O365 Connector API App##
To create the O365 Connector API App, carry out the following steps:

1.	Open the Azure Marketplace using the + NEW option at the bottom right of the Azure Portal.
2.	Browse to “Web and Mobile > API apps” and search for “Office365”.
3.	Configure the Office 365 Connector by providing the details for Hosting Plan, the resource group and selecting the name of the API App.

	![][21]


##Create a Logic App##
Let us create a simple logic app that gets triggered when an email is received (at your sales enquiry email id - say sales@contoso.com). And, it creates an event, adds a contact with the sender's details, sends an email to your personal account and finally sends a reply with an acknowledgment.

1.	Login to Azure Portal and click on ‘New -> Web + mobile -> Logic App’

	![][1]

2.	In the ‘Create logic app’ page, provide the required details such as name, app service plan and location.

	![][2]

3.	Click on ‘Triggers and Actions’ and the Logic App editor screen comes up.

	![][3]

4.	Select the Office 365 trigger from the 'API Apps in this resource group' section in the gallery to add it to the flow.

	![][4]

6.	Connecting to Office 365 requires you to authorize the Logic App to be able to access your account. Click on ‘Authorize’ to provide Office 365 login credentials.

	![][5]

7.	You will be redirected to Office 365 login page and you can authenticate with your Office 365 account credentials.

	![][6]

	![][7]

8.	Once the authorization is complete, Office 365 triggers are displayed.

	![][8]

9.	Select ‘New Email’ trigger and the input parameters are displayed.


10.	Change the trigger frequency to 'Minutes' and click ✓. 

	![][9]

11. The Office 365 'New Email' trigger is configured and you can see the output parameters also displayed.
	
	![][10]

12.	Select ‘Office 365 Connector’ from the ‘Recently Used’ section in the gallery and a new 'Office 365' action gets added.

13.	Select ‘Send Event’ from the list of actions and the input parameters of ‘Send Event’ action are displayed.

	![][11]

14.	Specify the event details and click ✓.

	![][12]

15.	Select ‘Office 365 Connector’ from the ‘Recently Used’ section in the gallery and a new 'Office 365' action gets added.

16.	Select ‘Add Contact’ from the list of actions and the input parameters of ‘Add Contact’ action are displayed.

	![][13]

17.	Click on '+' next to 'Email Address' field and select the 'From' output field value from the trigger.

	![][14]

18. Click on ✓ and the action configuration is complete.

	![][15]

19.	Select ‘Office 365 Connector’ from the ‘Recently Used’ section in the gallery and a new 'Office 365' action gets added.


20.	Select ‘Send Email’ from the list of actions and the input parameters of ‘Send Email’ action are displayed.

	![][19]

21.	Provide the details required to send the email. You can construct a message by typing something like below. Once the 'Send Email' action is configured, click on ✓ .

		Body - @concat('You got a new sales enquiry from',triggers().output.body.From)

	![][20]
22.	Select ‘Office 365 Connector’ from the ‘Recently Used’ section in the gallery and a new 'Office 365' action gets added.


23.	Select ‘Reply To’ from the list of actions and the input parameters of ‘Reply To’ action are displayed.

	![][16]

24.	Click '+' next to 'From' field and select the value from trigger's output message id and click ✓.

	![][17]

25. Click on OK on Logic app editor screen and then click 'Create'. It will take approximately 30 seconds for the creation to complete.

26. Send an email to the account you configured your trigger with and you should see an email in your personal mail account, calendar event and contact in your office mail account. Also, you should get a reply back acknowledging that the sales enquiry will be responded shortly.

<!--Image references-->
[1]: ./media/app-service-logic-connector-office365/1_New_Logic_App.png
[2]: ./media/app-service-logic-connector-office365/2_Logic_App_Settings.png
[3]: ./media/app-service-logic-connector-office365/3_Logic_App_Editor.png
[4]: ./media/app-service-logic-connector-office365/4_Select_Office365_Gallery.png
[5]: ./media/app-service-logic-connector-office365/5_Office365_Authorize.png
[6]: ./media/app-service-logic-connector-office365/6_Office365_Login.png
[7]: ./media/app-service-logic-connector-office365/7_Office365_User_Consent.png
[8]: ./media/app-service-logic-connector-office365/8_Office365_Trigger.png
[9]: ./media/app-service-logic-connector-office365/9_Office365_Trigger_Settings.png
[10]: ./media/app-service-logic-connector-office365/10_Office365_Trigger_Configured.png
[11]: ./media/app-service-logic-connector-office365/11_Office365_Actions_List.png
[12]: ./media/app-service-logic-connector-office365/12_Office365_Create_Event_Inputs.png
[13]: ./media/app-service-logic-connector-office365/13_Office365_Add_Contact_Inputs.png
[14]: ./media/app-service-logic-connector-office365/14_Office365_Add_Contact_Email_FromTrigger.png
[15]: ./media/app-service-logic-connector-office365/15_Office365_Add_Contacts_Configured.png
[16]: ./media/app-service-logic-connector-office365/16_Office365_Reply_To_Inputs.png
[17]: ./media/app-service-logic-connector-office365/17_Office365_Reply_To_MessageId.png
[18]: ./media/app-service-logic-connector-office365/18_Office365_Reply_To_Configured.png
[19]: ./media/app-service-logic-connector-office365/19_Office365_Send_Inputs.png
[20]: ./media/app-service-logic-connector-office365/20_Office365_Send_Configured.png
[21]: ./media/app-service-logic-connector-office365/21-create-new-o365-api-app.png


