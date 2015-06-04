<properties 
	pageTitle="Azure Multi-Factor Authentication Custom Voice Messages" 
	description="This describes how to use the Azure Multi-Factor Authentication feature of custom voice messages." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# Custom voice messages in Azure Multi-Factor Authentication

The following procedure will describe how to setup and configure custom voice messages for Azure Multi-Factor Authentication. This procedure assumes that you already have created an Multi-Factor Auth Provider. For information on creating an Multi-Factor Auth Provider see Creating an Multi-Factor Authentication Provider.

Before you begin be aware of the following:

- The current supported file formats are .wav and .mp3.
- The file size limit is 5MB.
- It is recommended that for Authentication messages that it be no longer than 20 seconds. Anything greater than this could cause the verification to fail because the user may not respond before the message finishes and the verification times out.



## To setup custom voice messages in Azure Multi-Factor Authentication
<ol>
<li>Create a custom voice message using one of the supported file formats. See Custom Voice Message Recommendations below.</li>
<li>Log on to http://azure.microsoft.com</li>
<li>On the left, select Active Directory.</li>
<li>At the top select Multi-Factor Auth Providers. This will bring up a list of your Multi-Factor Auth Providers.</li>
<li>If you have more than one Multi-Factor Auth Provider, select the one you wish to configure the custom voice message on and click Manage at the bottom of the page. If you have only one, just click Manage. This will open the Azure Multi-Factor Authentication Management Portal.</li>
<li>On the Azure Multi-Factor Authentication Management Portal, on the left, click Voice Messages.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-custom/custom1.png)</center>

<li>Under the Voice Messages section, click New Voice Message.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-custom/custom2.png)</center>

<li>On the Configure: New Voice Messages page, click Manage Sound Files.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-custom/custom3.png)</center>

<li>On the Configure: Sound Files page, click Upload Sound File.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-custom/custom4.png)</center>

<li>On the Configure: Upload Sound File, click Browse and navigate to your voice message, click Open.</li>
<li>Add a Description and click Upload.</li>
<li>Once this completes, you will see a message that you have successfully uploaded the file.</li>
<li>On the left, click Voice Messages.</li>
<li>Under the Voice Messages section, click New Voice Message.</li>
<li>From the Language drop-down, select a language.</li>
<li>If this message is for a specific application, specify it in the Application box.</li>
<li>From the Message Type, select the message type that will be overridden with our new custom message.</li>
<li>From the Sound File drop-down, select your sound file.</li>
<li>Click Create. You will see a message that says you have successfully created a voice message.</li>

<center>![Cloud](./media/multi-factor-authentication-manage-custom/custom5.png)</center>

