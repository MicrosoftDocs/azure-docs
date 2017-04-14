#Add Lead Management Details
Submit lead configuration details for your CRM system of choice in the Seller Dashboard in order to start receiving information about users who acquire your add-in. 

Leads enable you to follow up with the customer directly, and ensure they have a successful experience with your solution. 

##Lead information provided
For customers who acquire your add-in via the Office Store or AppSource, the following details will be sent to your chosen lead management system:

>	First Name, Last Name, Email Address

##Submitting lead management information in Seller Dashboard
Within your submission process, you will be prompted to submit lead configurations details in order to start receiving leads. Please navigate to the “Lead Management” tab within the draft submission process.
>	Ensure you select the checkbox to enable lead management.

Regardless of your system, you must provide the following:

|**Value**|**Description**|
|:-----|:-----|
|Offer Display Name|A title to annotate how the lead was generated. E.g. "Contoso Business Planner Add-in"|
|Publisher Display Name|A title to represent your publisher information within the lead. E.g. "Contoso Add-in Development team"|

##Choose your lead destination
Choose one of the available CRM or storage services within the dropdown and follow the corresponding set of steps below to complete your lead management submission. 
>**Note:** If your system of choice is not listed below, we recommend Azure Table as storage service that can be integrated with by most popular CRM services.

##Azure Table
This process will output lead information into an Azure-hosted storage table. Click [here](https://azure.microsoft.com/en-us/free/) to get started with Azure.
You must submit a **Connection String** value to submit your lead management details. To find or generate this value, please follow these steps:

 1. Inside the Azure management portal, select the **Storage Account** the lead should be sent to.
 2. To create a new Storage account, go to Storage Account in the navbar and select Add in the top left of the header.
 3. Once you have selected the Storage account, select **Access Keys** under the Settings section.
 4. Copy the storage account key shown under **Primary Connection String**.
 5. Submit this string as the **Connection String** within **Seller Dashboard**.


##CSV Blob
This process will output lead information in a CSV format within an Azure-hosted blob. Click [here](https://azure.microsoft.com/en-us/free/) to get started with Azure.
You must submit a **Connection String** value as well as a **Container Name** value to submit your lead management details. To find or generate these values, please follow these steps:

 1. Inside the Azure management portal, select the **Storage Account** you
    want to the leads sent to.
 2. To create a new Storage account, Storage Account in the navbar and
    “Add” in the top left of the header.
 3. Once you have selected the Storage account, **Access Keys** under the
    Settings section.
 4. Copy the storage account key shown under **Primary Connection String**.
 5. Submit this string as the **Connection String** within **Seller Dashboard**.
 6. Select **Containers** under the Blob Services section for the same Storage Account.
 7. Click on the Container you wish to send the csv data to, or create anew Container.
 8. Copy the **Name** of the chosen Container.
 9. Submit this string as the **Container Name** within **Seller Dashboard**.

##Salesforce

In order to direct your lead information to a Salesforce CRM system, you must provide an **Object Identifier** value. To find this value, please follow these steps:

 1. Within your Salesforce CRM system, navigate to **Setup**.
 2. In the Quick Find search bar, type in **“Web-to-Lead”**.
 3. Select **Create Web-to-Lead Form** on the next page. 
 4. Ignore the form on the next page and select **Generate**.
 5. Within the generated form, find the **oid value**, with the format:

		<input type=hidden name="oid" value="00XXXXXXXXXXXXX">

 6. Copy this value and submit it as the **Object Identifier** within **Seller Dashboard**.

##Marketo
In order to direct your lead information to a Marketo CRM system, you must provide **Form Id** , **Munchkin Id** and **Server Id** values. To find these values, please follow these steps:

1.	Go to **Design Studio** within Marketo.
2.	Click on **New Form**.
3.	Fill in the fields in the New Form popup.
4.	Click on **Finish** on the Field Details form. Approve and close the form.
5.	Under Form Actions, select **Embed Code**.
6.	Within the embed code, look for the following line:

	    <script>MktoFormsExample.loadForm("//app-ys11.marketo.com", "123-PQR-789", 1169);</script>

>In this example, the following values need to be extracted as such:
>|**Parameter Name**|**Example Value**|
|:-----|:-----|
|Form Id|ys11|
|Munchkin Id|123-PQR-789|
|Server Id|1169|

Submit your system's values within **Seller Dashboard**. 

##Microsoft Dynamics
For Microsoft Dynamics CRM systems, you will need to provide your **CRM Url**, **User Name** and **Password**. 

Please see this AppSource documentation for steps on [setting up a new Dynamics service for leads](https://aka.ms/leadsettingfordynamicscrm).

>**Note:** Configuring leads will need services that require the user to be an admin on your Dynamics CRM instance, and a tenant admin to create a new service account.  


##Submit your lead management details
Once your form has been completed as required, please select **Next**. 

If you receive an error message, please ensure your details are correct or try again later. 

>**Note:** If your add-in is already within the Store, your lead management details will be saved regardless of whether your store submission passes validation. There is no need to submit lead management details again  unless you wish to update where your leads are sent to.

 

##Communication Guidelines
Please ensure that any correspondence you send to customers includes an option to unsubscribe from future communications. 
