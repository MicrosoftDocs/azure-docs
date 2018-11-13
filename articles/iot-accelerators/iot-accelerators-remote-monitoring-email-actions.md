---
title: Email action within Remote Monitoring - Azure | Microsoft Docs
description: This how-to guide shows you how to add an email action to a new or existing rule.
author: asdonald
manager: hegate
ms.author: asdonald
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 11/12/2018
ms.topic: conceptual

# As a developer, I want to add email as an action to a new or existing rule within my Remote Monitoring solution.
---


# Add an email action
Adding an email action to a rule helps make sure that you will never miss an alert. You can either add an email action to an existing rule that you have defined earlier, or while creating a new rule. 

[!INCLUDE [iot-accelerators-tutorial-prereqs](../../includes/iot-accelerators-tutorial-prereqs.md)]

To create or modify a rule, you must be an Admin for your solution accelerator, or have the correct permissions. [Learn how to configure role-based access controls](iot-accelerators-remote-monitoring-rbac.md).

## Edit Existing rule

Follow these steps to add an email action:
  1. Navigate to your Remote Monitoring solution.
  2. From your dashboard, navigate to the **Rules** page.

      ![rules](./media/iot-accelerators-remote-monitoring-email-actions/rules.png)

  3. Click the checkbox next to the [existing rule](iot-accelerators-remote-monitoring-automate#edit-an-existing-rule) that you would like to modify, and then click **Edit** at the top. An editable flyout will appear.
  4. In the Action section, toggle **Email enabled** to on. 
  5. If it is the first-time email actions have been enabled within the solution accelerator, you will need to [sign in to outlook](#outlook).
  6. Enter an email address into the recipient box and hit enter for each email address added. 
      ![address](./media/iot-accelerators-remote-monitoring-email-actions/address.png)
  7. Enter a subject for the email.
  8. Enter any additional notes for the email recipients in **text format**. *HTML* formatting is supported by editing the email template. [Directions for editing the HTML format](#htmledit)
  9. Make sure that **Rule Status** is enabled
  10. Click **Apply**

## Create a new rule

Follow these steps to add an email action:
  1. Navigate to your Remote Monitoring solution.
  2. From your dashboard, navigate to the **Rules** page. 

      ![rules](./media/iot-accelerators-remote-monitoring-email-actions/rules.png)

  3. Follow the [create a rule](iot-accelerators-remote-monitoring-automate#create-a-rule) and [create an advanced rule](iot-accelerators-remote-monitoring-automate#create-an-advanced-rule) up to the **Severity level** only. Do *not* click apply yet. 
  4. In the Action section, toggle **Email enabled** to on. 
  5. If it is the first-time email actions have been enabled within the solution accelerator, you will need to [sign in to outlook](#outlook).
  6. Enter an email address into the recipient box and hit enter for each email address added. 
      ![address](./media/iot-accelerators-remote-monitoring-email-actions/address.png)
  7. Enter a subject for the email.
  8. Enter any additional notes for the email recipients in **text format**. *HTML* formatting is supported by editing the email template. [Directions for editing the HTML format](#htmledit)
  9. Make sure that **Rule Status** is enabled
  10. Click **Apply**

Your rule with *Email Action* has now been enabled. Each time the action is triggered, a new email will be sent out. 

## Sign in to Outlook <a name="outlook"></a>

If it is your first-time enabling email actions within your solution accelerator, you need to sign into Outlook. This is to set up an email account, which will be responsible for sending out the email notification. 

> [!NOTE] 
> It is recommended that you create a specific Outlook account just for solution accelerator notifications and use that to sign in with. You will continue to see this warning note until you have signed in with an Outlook account. Once you have signed in, you will see a successful message below the email actions toggle. 

If your application was deployed by someone with a **contributor** role on the subscription, you will see the following screenshot. Follow the instructions below to set up Outlook for your application. 

![learn more](./media/iot-accelerators-email-actions/learnmore.png)

### Contributor role Outlook set up
Since the application was deployed by someone with the **contributor** role in the subscription, the application does 
not have sufficient permissions to set up and verify email actions through the WebUI. However, the following steps will allow you to manually set up and verify the email actions. 

  1. Go to the [Azure portal](https://portal.azure.com)
  2. Navigate to the Resource Group for your solution accelerator
  3. Click on the office 365 connector (API Connection)
    ![API Connection](./media/iot-accelerators-email-actions/apiconnector.png)
  4. Click on the banner to begin the authorization process
    ![authorize](./media/iot-accelerators-email-actions/connector.png)
  5. Click the **authorize** button in which it will ask you to sign in. This account you sign in with will be the email address the application uses to send email from. We advise that you create an outlook account ahead of time to send email notifications for your solution accelerator from.
    ![authorize button](./media/iot-accelerators-email-actions/authorize.png)
    ![sign in](./media/iot-accelerators-email-actions/signin.png)
  7. Click **Save** at the bottom. Your authorization will be successful if the banner is gone.
  9. To change the email address from which the notifications are sent from, click **Edit API connection**.
    ![change email](./media/iot-accelerators-email-actions/editemail.png)

### Owner role Outlook set up
Since the application was deployed by someone with the **owner** role in the subscription, the application is able to verify email actions have been correctly set up through the WebUI. The following steps will help you sign in and set up email actions.

  1. Click to sign in to Outlook. You will be taken to the Azure portal.
    ![sign in](./media/iot-accelerators-email-actions/owneroutlook.png)
  2. Click the **authorize** button in which it will ask you to sign in. This account you sign in with will be the email address the application uses to send email from. We advise that you create an outlook account ahead of time to send email notifications for your solution accelerator from. 
  3. Click **Save** at the bottom. Return back to your application and refresh the page. 
  4. You will see a banner if you have successfully configured the email notification. 
    ![successful lo in](./media/iot-accelerators-email-actions/success.png)

## Customizing the email HTML <a name="htmledit"></a>

Out of the box, the Remote Monitoring solution accelerator provides a basic HTML template for emails sent when alerts are triggered. The email constructed is based off of the variables filled out when setting up email action. Here's an example of email sent when an alert is triggered and email actions are enabled: 

![email example](./media/iot-accelerators-remote-monitoring-email-actions/emailtemplate.png)

However, if you would like to edit the HTML to include more information, custom images, etc. follow these steps:
  1. Make sure that you have cloned the Github repository for Remote Monitoring in either .NET or Java. 
  2. Navigate to the email template location.
    
      `Dotnet: device-telemetry\ActionsAgent\data\EmailTemplate.html`
    
      `Java device-telemetry/app/resources/data/EmailTemplate.html`
  3. This template is where you can add or remove any parameters. Make sure to also add or remove, or replace calls as needed. 

      For example, in the .NET code: 
      `emailTemplate = emailTemplate.Replace("${subject}", emailAction.GetSubject());`

      For example, in the Java code:
      `this.emailTemplate.replace("${subject}", emailAction.GetSubject());`
  4. Parameters in the template are in the form of `${...}`. If you want to delete a parameter, just delete the required line. If you want to add a parameter, add a line with the value you want inserted into the template in the format above. 
  5. If you would like to add images or any other custom text, updates can be directly in the `EmailTemplate.HTML`

## Throttling

The Remote Monitoring solution accelerator out of the box uses Outlook to send out the email notifications. Outlook limits the number of emails sent to [30 emails per 1 minute](https://docs.microsoft.com/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits#receiving-and-sending-limits). Email clients receiving the emails may also throttle the number of emails received per minute. Check with your specific email client on limitations. It is recommended that when you set up email notification for a rule, that you have the rule calculate over an average of 1 minute or more, and not instant, as shown below. 

![calculation](./media/iot-accelerators-email-actions/calculation.png)

## Next steps

This guide showed you how to add an email action to a new or existing rule within a Remote Monitoring solution and how to edit the HTML.

The suggested next step is to learn [how to use alerts and fix device issues](iot-accelerators-remote-monitoring-maintain.md).
