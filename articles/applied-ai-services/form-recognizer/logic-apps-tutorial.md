# Form Recognizer with Logic Apps Quickstart

## Introduction to Logic Apps

Azure logic apps are a tool that can be used to automate workflows without writing a single line of code. Azure logic apps are easily integrated with Microsoft applications along with third party applications. The following are the benefits of the Azure Logic Apps system:

* The ability to create business process and workflows visually.
* The ability to integrate workfolows with SaaS and enterprise applications. 
* The ability to automate EAI, B2B/EDI and buisness processes.

Please refer to [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/) for more info.

## Tutorial 

In this tutorial you will learn to make a Logic app connector flow that detects when an invoice is added to a folder in a one drive, processes the invoice, and sends information contained in the invoice to a pre-specified email.

### Prerequisites 

To complete this quick start, you are going to need:

* An Azure subcription - Create one for free here: [Create an Azure subscription](https://azure.microsoft.com/en-us/free/cognitive-services/)
* A one drive account - Create one for free here: [Create a One drive account](https://onedrive.live.com/signup)
* An Outlook online email account - Create one for free here: [Create an outlook online email account](https://signup.live.com/signup.aspx?lic=1&mkt=en-ca)
* a sample invoice to test your azure logic app - Download a sample [here](need to link invoice here)

### Setting up One-Drive 

Before we jump into creating the Logic app, we to have to set up a One drive folder. 

1. Got your one drive home page - [One drive home page](https://onedrive.live.com/)

2. Select "+New" in the upper left corner and select Folder.

  ![MakeNewFolder]()
  
3. Enter a name for your new folder and select create.

  ![NameNewFolder]()
 
4.You should see the new folder in your files. For now we are done with OneDrive. Open a new tab youwill need to access this folder later. 

### Create a Form Recognizer resource 

Now we are going to create a Form recognizer resource in the Azure portal. If you already have a Form recognizer resource, you can skip this section.

1. Navigate to the Azure portal home page - [Azure home page](https://ms.portal.azure.com/#home)

2. First select create a resource from the Azure home page. 

  ![CreateResource]()
   
3. You should see a screen like the one below, search Form Recognizer in the search bar. 

  ![CreateFRResource]()
  
4. Select the Form Recognizer tile. 

  ![FormRecognizerTile]()
  
5. Select the Create button. 

  ![CreateButton]()

6. Now you are going to fill out the "Create Form Recognizer" fields with the following values:

* For the subscription box select your current subscription.
* For the resource group select the resource group that you created earlier from the drop down. 
* For region, select your local region.
* For Name you can enter any name that is descriptive such as "FR-Resource".
* For pricing tier you can select the free tier for this tutorial. 

