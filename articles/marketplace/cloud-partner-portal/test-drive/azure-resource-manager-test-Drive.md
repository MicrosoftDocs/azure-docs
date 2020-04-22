---
title: Azure Resource Manager Test Drive | Azure Marketplace
description: Build a Marketplace Test Drive using Azure Resource Manager
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: dsindona
---

# Azure Resource Manager Test Drive

This article is for Publishers who have their offer on the Azure
Marketplace, or who are on AppSource but want to build their Test Drive
with only Azure resources.

An Azure Resource Manager (Resource Manager) template is a coded container of Azure
resources that you design to best represent your solution. If you are unfamiliar with what a Resource Manager template is, read up on [understanding Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) and [authoring Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates) to make sure you know how to build and test your own templates.

What Test Drive does is that it takes the provided Resource Manager template and makes a deployment of all the resources required from that Resource Manager template into a resource group.

If you choose to build an Azure Resource Manager Test Drive, the requirements are for you to:

- Build, test, and then upload your Test Drive Resource Manager template.
- Configure all required metadata and settings to enable your Test Drive.
- Republish your offer with Test Drive enabled.

## How to build an Azure Resource Manager Test Drive

Here is the process for building an Azure Resource Manager Test Drive:

1. Design what you want your customers to do in a flow diagram.
1. Define what experiences you would like your customers to build.
1. Based on the above definitions, decide what pieces and resources are needed for customers to accomplish such experience: for example, D365 instance, or a website with a database.
1. Build the design locally, and test the experience.
1. Package the experience in an ARM template deployment, and from there:
    1. Define what parts of the resources are input parameters;
    1. What variables are;
    1. What outputs are given to the customer experience.
1. Publish, test, and go live.

The most important part about building an Azure Resource Manager Test Drive is to define what scenario(s) you want your customers to experience. Are you a firewall product and you want to demo how well you handle script injection attacks? Are you a storage product and you want to demo how fast and easy your solution compresses files?

Make sure to spend a sufficient amount of time evaluating what are the best ways to show off your product. Specifically around all the required resources you would need, as it makes packaging the Resource Manager template sufficiently easier.

To continue with our firewall example, the architecture may be that you need a public IP URL for your service and another public IP URL for the website that your firewall is protecting. Each IP is deployed on a Virtual Machine and connected together with a network security group + network interface.

Once you have designed the desired package of resources, now comes the writing and building of the Test Drive Resource Manager template.

## Writing Test Drive Resource Manager templates

Test Drive runs deployments in a fully automated mode, and because of that, Test Drive templates have some restrictions described below.

### Parameters

Most templates have a set of parameters. Parameters define resource names, resources sizes (for example, types of storage accounts or virtual machine sizes), user names and passwords, DNS names and so on. When you deploy solutions using Azure portal, you can manually populate all these parameters, pick available DNS names or storage account names, and so on.

![List of parameters in an Azure Resource Manager](./media/azure-resource-manager-test-drive/param1.png)

However, Test Drive works in a fully automatic mode, without human interaction, so it only supports a limited set of parameter categories. If a parameter in the Test Drive Resource Manager template doesn't fall into one of the supported categories, you must **replace this parameter with a variable or constant value.**

You can use any valid name for your parameters, Test Drive recognizes parameter category by using metadata-type value. You **must specify metadata-type for every template parameter**, otherwise your template will not pass validation:

```json
"parameters": {
  ...
  "username": {
    "type": "string",
    "metadata": {
      "type": "username"
    }
  },
  ...
}
```

It is also important to note that **all parameters are optional**, so if you don\'t want to use any, you don\'t have to.

### Accepted Parameter Metadata Types

| Metadata Type   | Parameter Type  | Description     | Sample Value    |
|---|---|---|---|
| **baseuri**     | string          | Base URI of your deployment package| https:\//\<\..\>.blob.core.windows.net/\<\..\> |
| **username**    | string          | New random user name.| admin68876      |
| **password**    | secure string    | New random password | Lp!ACS\^2kh     |
| **session id**   | string          | Unique Test Drive session ID (GUID)    | b8c8693e-5673-449c-badd-257a405a6dee |

#### baseuri

Test Drive initializes this parameter with a **Base Uri** of your deployment package, so you can use this parameter to construct Uri of any file included into your package.

```json
"parameters": {
  ...
  "baseuri": {
    "type": "string",
    "metadata": {
      "type": "baseuri",
      "description": "Base Uri of the deployment package."
    }
  },
  ...
}
```

Inside your template, you can use this parameter to construct a Uri of any file from your Test Drive deployment package. The example below shows how to construct a Uri of the linked template:

```json
"templateLink": {
  "uri": "[concat(parameters('baseuri'),'templates/solution.json')]",
  "contentVersion": "1.0.0.0"
}
```

#### username

Test Drive initializes this parameter with a new random user name:

```json
"parameters": {
  ...
  "username": {
    "type": "string",
    "metadata": {
      "type": "username",
      "description": "Solution admin name."
    }
  },
  ...
}
```

Sample value:

    admin68876

You can use either random or constant usernames for your solution.

#### password

Test Drive initializes this parameter with a new random password:

```json
"parameters": {
  ...
  "password": {
    "type": "securestring",
    "metadata": {
      "type": "password",
      "description": "Solution admin password."
    }
  },
  ...
}
```

Sample value:

    Lp!ACS^2kh

You can use either random or constant passwords for your solution.

#### session ID

Test Drive initialize this parameter with a unique GUID representing
Test Drive session ID:

```json
"parameters": {
  ...
  "sessionid": {
    "type": "string",
    "metadata": {
      "type": "sessionid",
      "description": "Unique Test Drive session id."
    }
  },
  ...
}
```

Sample value:

    b8c8693e-5673-449c-badd-257a405a6dee

You can use this parameter to uniquely identify the Test Drive session, if it's necessary.

### Unique Names

Some Azure resources, like storage accounts or DNS names, requires globally unique names.

This means that every time Test Drive deploys the Resource Manager template, it creates a **new resource group with a unique name** for all its\' resources. Therefore it is required to use the [uniquestring](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-functions#uniquestring) function concatenated with your variable names on resource group IDs to
generate random unique values:

```json
"variables": {
  ...
  "domainNameLabel": "[concat('contosovm',uniquestring(resourceGroup().id))]",
  "storageAccountName": "[concat('contosodisk',uniquestring(resourceGroup().id))]",
  ...
}
```

Make sure you concatenate your parameter/variable strings (\'contosovm\') with a unique string output (\'resourceGroup().id\'), because this guarantees the uniqueness and reliability of each variable.

For example, most resource names cannot start with a digit, but unique string function can return a string, which starts with a digit. So, if you use raw unique string output, your deployments will fail. 

You can find additional information about resource naming rules and
restrictions in [this article](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

### Deployment Location

You can make you Test Drive available in different Azure regions. The idea is to allow a user to pick the closest region, to provide with the beast user experience.

When Test Drive creates an instance of the Lab, it always creates a resource group in the region chose by a user, and then executes your deployment template in this group context. So, your template should pick the deployment location from resource group:

```json
"variables": {
  ...
  "location": "[resourceGroup().location]",
  ...
}
```

And then use this location for every resource for a specific Lab instance:

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "location": "[variables('location')]",
    ...
  },
  {
    "type": "Microsoft.Network/publicIPAddresses",
    "location": "[variables('location')]",
    ...
  },
  {
    "type": "Microsoft.Network/virtualNetworks",
    "location": "[variables('location')]",
    ...
  },
  {
    "type": "Microsoft.Network/networkInterfaces",
    "location": "[variables('location')]",
    ...
  },
  {
    "type": "Microsoft.Compute/virtualMachines",
    "location": "[variables('location')]",
    ...
  }
]
```

You need to make sure that your subscription is allowed to deploy all the resources you want to deploy in each of the regions you are selecting. As well, you need to make sure that your virtual machine images are available in all the regions you are going to enable, otherwise your deployment template will not work for some regions.

### Outputs

Normally with Resource Manager templates, you can deploy without producing any output. This is because you know all the values you use to populate template parameters and you can always manually inspect properties of any resource.

For Test Drive Resource Manager templates however, it\'s important to return to Test Drive all the information, which is required to get an access to the lab (Website URIs, Virtual Machine host names, user names, and passwords). Make sure all your output names are readable because these variables are presented to the customer.

There are no any restrictions related to template outputs. Just remember, Test Drive converts all output values into **strings**, so if you send an object to the output, a user will see JSON string.

Example:

```json
"outputs": {
  "Host Name": {
    "type": "string",
    "value": "[reference(variables('pubIpId')).dnsSettings.fqdn]"
  },
  "User Name": {
    "type": "string",
    "value": "[parameters('adminName')]"
  },
  "Password": {
    "type": "string",
    "value": "[parameters('adminPassword')]"
  }
}
```

### Subscription Limits

One more thing you should take into consideration is subscription and service limits. For example, if you want to deploy up to ten 4-core virtual machines, you need to make sure the subscription you use for your Lab allows you to use 40 cores.

You can find more information about Azure subscription and service limits in [this article](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits). As multiple Test Drives can be taken at the same time, verify that your subscription can handle the \# of cores multiplied by the total number of concurrent Test Drives that can be taken.

### What to upload

Test Drive Resource Manager template is uploaded as a zip file, which can include various deployment artifacts, but needs to have one file named **main-template.json**. This file is Azure Resource Manager deployment template, and Test Drive uses it to instantiate a Lab.

If you have additional resources beyond this file, you can reference it as an external resource inside the template, or you can include the resource in the zip file.

During the publishing certification, Test Drive unzips your deployment package and puts its content into an internal Test Drive blob container. The container structure reflects the structure of your deployment package:

| package.zip                       | Test Drive blob container         |
|---|---|
| main-template.json                | https:\//\<\...\>.blob.core.windows.net/\<\...\>/main-template.json  |
| templates/solution.json           | https:\//\<\...\>.blob.core.windows.net/\<\...\>/templates/solution.json |
| scripts/warmup.ps1                | https:\//\<\...\>.blob.core.windows.net/\<\...\>/scripts/warmup.ps1  |


We call a Uri of this blob container Base Uri. Every revision of your Lab has its own blob container, and, therefore, every revision of your Lab has its own Base Uri. Test Drive can pass a Base Uri of your unzipped deployment package into your template through template parameters.

## Transforming Template Examples for Test Drive

The process from turning an architecture of resources into a Test Drive Resource Manager template can be daunting. In order to help make this process easier, we\'ve made examples on how to best [transform current deployment templates here](./transforming-examples-for-test-drive.md).

## How to publish a Test Drive

Now that you have your Test Drive built, this section walks through each of the fields required for you to successfully publish your Test Drive.

![Enabling Test Drive in the user interface](./media/azure-resource-manager-test-drive/howtopub1.png)

The first and most important field is to toggle whether you want Test Drive enabled for your offer or not. When you select **Yes,** the rest of the form with all of the required fields are presented for you to fill out. When you select **No,** the form becomes disabled and if you
republish with the Test Drive disabled, your Test Drive is removed from production.

Note: If there are any Tests Drives actively used by users, those Test Drives will continue to run until their session expires.

### Details

The next section to fill out is the details about your Test Drive offer.

![Test Drive detailed information](./media/azure-resource-manager-test-drive/howtopub2.png)

**Description -** *Required* This is where you write the main description about what is on your Test Drive. The customer will come here to read what scenarios your Test Drive will be covering about your product. 

**User Manual -** *Required* This is the in-depth walkthrough of your Test Drive experience. The customer will open this and can walk through exactly what you want them to do throughout their Test Drive. It is important that this content is easy to understand and follow! (Must be a
.pdf file)

**Test Drive Demo Video -** *Recommended* Similar to the User Manual, it is best to include a video tutorial of your Test Drive experience. The customer will watch this prior or during their Test Drive and can walk through exactly what you want them to do throughout their Test
Drive. It is important that this content is easy to understand and follow!

- **Name** - Title of your Video
- **Link** - Must be an embedded URL from your tube or video. Example on how to get the embedded url is below:
- **Thumbnail** - Must be a high-quality image (533x324) pixels. It is recommended to take a screenshot of some part of your Test Drive experience here.

Below is how these fields show up for your customer during their Test Drive experience.

![Location of Test Drive fields in the Marketplace offer](./media/azure-resource-manager-test-drive/howtopub4.png)

### Technical Configuration

The next section to fill out is where you upload your Test Drive Resource Manager template and define how specifically your Test Drive instances work.

![](./media/azure-resource-manager-test-drive/howtopub5.png)

**Instances -** *Required* This is where you configure how many  instances you want, in what region(s), and how fast your customers can get the Test Drive.

- **Instances** - The Select regions is where you pick where your Test Drive Resource Manager template is deployed in. It is recommended to just pick one region where you most expect your customers to be located at.
- **Hot** - Number of Test Drive instances that are already deployed and awaiting access per selected region. Customers can instantly access this Test Drives rather than having to wait for a
    deployment. The tradeoff is that these instances are always running on your Azure subscription, so they will incur a larger uptime cost. It is highly recommended to have **at least one Hot instance**, as most of your customers don't want to wait for full deployments to finish and so there is a drop-off in customer usage.
- **Warm** - Number of Test Drive instances per region that have been deployed and then the VM has been stopped and stored in Azure storage. The wait time for Warm instances is slower than Hot
    instances, but the uptime cost of storage is also less expensive.
- **Cold** - Number of Test Drive instances per region that can possibly be deployed. Cold instances require the entire Test Drive Resource Manager template to go through a deployment at the time of a customer requesting the Test Drive, so it is slower than Hot or Warm instances. However, the tradeoff is that you only have to pay for the duration of the Test Drive.

At this time calculates the total number of potential concurrent Test Drives you are going to make available, and verify that your quota limit for your subscription can handle that concurrent amount:

**(Number of Regions Selected x Hot instances) + (Number of Regions Selected x Warm instances) + (Number of Regions Selected x Cold instances)**

**Test Drive Duration (hours) -** *Required* Duration for how long the Test Drive will stay active, in \# of hours. The Test Drive terminates automatically after this time period ends.

**Test Drive Resource Manager template -** *Required* Upload your Resource Manager template
here. This is the file you built in the previous section above. Name the main template file: "main-template.json" and make sure that your Resource Manager template contains output parameters for key variables that are needed. (Must be a .zip file)

**Access Information -** *Required* After a customer gets their Test Drive, the access information is presented to them. These instructions are meant to share the useful output parameters from your Test Drive Resource Manager template. To include output parameters, use double curly brackets (for example, **{{outputname}}**), and they will be inserted correctly in the location. (HTML string formatting is recommended here to render in the front end).

### Test Drive Deployment Subscription Details

The final section to fill out is to be able to deploy the Test Drives automatically by connecting your Azure Subscription and Azure Active Directory (AD).

![Test Drive deployment subscription details](./media/azure-resource-manager-test-drive/subdetails1.png)

**Azure Subscription ID -** *Required* This grants access to Azure services and the Azure portal. The subscription is where resource usage is reported and services are billed. If you do not already have a **separate** Azure Subscription for Test Drives only, go ahead and make one. You can find Azure Subscription Ids by logging in to Azure portal and navigating to the Subscriptions on the left-side menu. (Example: "a83645ac-1234-5ab6-6789-1h234g764ghty")

![Azure Subscriptions](./media/azure-resource-manager-test-drive/subdetails2.png)

**Azure AD Tenant ID -** *Required* If you have a Tenant ID already available you can find it below in the Properties -\> Directory ID.

![Azure Active Directory properties](./media/azure-resource-manager-test-drive/subdetails3.png)

Otherwise, create a new Tenant in Azure Active Directory.

![List of Azure Active Directory tenants](./media/azure-resource-manager-test-drive/subdetails4.png)

![Define the organization, domain and country/region for the Azure AD tenant](./media/azure-resource-manager-test-drive/subdetails5.png)

![Confirm the selection](./media/azure-resource-manager-test-drive/subdetails6.png)

**Azure AD App ID -** *Required* Next step is to create and register a
new application. We will use this application to perform operations on
your Test Drive instance.

1. Navigate to the newly created directory or already existing directory and select Azure Active directory in the filter pane.
2. Search "App registrations" and click on "Add"
3. Provide an application name.
4. Select the Type of as "Web app / API"
5. Provide any value in Sign-on URL, we won\'t be using that field.
6. Click create.
7. After the application has been created, go to Properties -\> Set the application as multi-tenant and hit Save.

Click Save. The last step is to grab the Application ID for this registered app and paste it in the Test Drive field here.

![Azure AD application ID detail](./media/azure-resource-manager-test-drive/subdetails7.png)

Given we are using the application to deploy to the subscription, we need to add the application as a contributor on the subscription. The instructions for these are as below:

1. Navigate to the Subscriptions blade and select the appropriate subscription that you are using for the Test Drive only.
1. Click **Access control (IAM)**.
1. Click the **Role assignments** tab.
    ![Add a new Access Control principal](./media/azure-resource-manager-test-drive/SetupSub7_1.jpg)
1. Click **Add role assignment**.
1. Set the role as **Contributor**.
1. Type in the name of the Azure AD application and select the application to assign the role.
    ![Add the permissions](./media/azure-resource-manager-test-drive/SetupSub7_2.jpg)
1. Click **Save**.

**Azure AD App Key -** *Required* The final field is to generate an authentication key. Under keys, add a Key Description, set the duration to never expire, then select save. It is **important** to avoid having an expired key, which will break your test drive in production. Copy this value and paste it into your required Test Drive field.

![Shows the Keys for the Azure AD application](./media/azure-resource-manager-test-drive/subdetails8.png)

## Next steps

Now that you have all of your Test Drive fields filled out, go through and **Republish** your offer. Once your Test Drive has passed certification, you should go an extensively test the customer experience in the **preview** of your offer. Start a Test Drive in the UI and then
open up your Azure Subscription inside the Azure portal and verify that your Test Drives are being fully deployed correctly.

![Azure portal](./media/azure-resource-manager-test-drive/subdetails9.png)

It is important to note that you do not delete any Test Drive instances as they are provisioned for your customers, so the Test Drive service will automatically clean these Resource Groups up after a customer is finished with it.

Once you feel comfortable with your Preview offering, now it is time to **go live**! There is a final review process from Microsoft once the offer has been published to double check the entire end to end experience. If for some reason the offer gets rejected, we will send a notification to the engineering contact for your offer explaining what will need to get fixed.

If you have more questions, are looking for troubleshooting advice, or want to make your Test Drive more successful, please go to [FAQ, Troubleshooting, & Best Practices](./marketing-and-best-practices.md).
