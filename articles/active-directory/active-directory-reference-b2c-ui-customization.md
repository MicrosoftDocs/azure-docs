<properties
	pageTitle="Page UI customization - Azure Active Directory B2C"
	description="Page UI customization - Azure Active Directory B2C"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/13/2015"
	ms.author="swkrish"/>

# How to customize the UI of pages served by Azure Active Directory B2C

User experience is paramount in a consumer-facing application. It is the difference between a good application and a great one, and between merely active users and truly engaged ones. Azure AD B2C allows you to customize user sign up, sign in (*see note below*) and profile editing pages with pixel-perfect control.

> [AZURE.NOTE]
Currently, local account sign-in and password reset pages are only customizable using the [company branding feature](active-directory-add-company-branding.md).

In this article, you will read about:

- Overview of the page UI customization feature.
- A sample demonstrating the feature.
- The core UI elements in each type of page.
- Best practices when exercising this feature.

## The page UI customization feature

The page UI customization feature allows you to customize the look-and-feel of your sign up, sign in and profile editing pages (by configuring policies). Your users will have consistent experiences when navigating between your application and pages served by the Azure AD B2C service.

> [AZURE.NOTE]
Policies define interfaces and behaviors that users experience when signing up for, signing into and editing profiles in your application that has been secured by Azure AD B2C.

Unlike other services where options are limited or are only available via APIs, Azure AD B2C uses a different (and simpler) approach to page UI customization. Here's how it works: Azure AD B2C runs code in your user's browser and uses a modern approach called [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/) to load content from a URL that you specify in a policy. You can specify different URLs for different pages. The code merges Azure AD B2C's content (called UI elements) and the content loaded from your URL, and displays the page to your user. All you need to do is create well-formed HTML5 content with a `<div id="api"></div>` element located somewhere in the `<body>` - this is where the Azure AD B2C's content gets merged into. And host this content on an HTTPS endpoint with CORS allowed. You can also fully style Azure AD B2C's UI elements.

This approach allows you to go from the default sign-up page provided by Azure AD B2C (image on the left) to something as delightful (and custom) as the image on the right.

## Sample demonstrating the feature

Following the steps below will allow you to exercise the page UI customization feature using our sample content. For the purposes of demonstration, the content is only **static** HTML5; you can switch it to **dynamic** HTML5 if you want.

1. You will copy our sample content and store it on [Azure Blob Storage](http://azure.microsoft.com/documentation/services/storage/), and make it accessible publicly via HTTPS.
2. You will turn on CORS on the Azure Blob Storage URLs where the content gets stored.
3. You will modify the page UI customization options in your existing sign-up policy to specify the above URLs.

Complete the following pre-requisites before you get started:

- Build a [web application](active-directory-webapp-dotnet-b2c.md) that has been secured by Azure AD B2C. One of the steps in this tutorial is to create a sign-up policy that you will modify here.
- Download any one of our [sample content](TBD) repositories from github. Unzip the folder to access the actual content (HTML and image files).
- Download the [console application](TBD) that sets CORS properties on your Azure Blob Storage. This is a Visual Studio 2013 solution.

### Step 1: Store the sample content in the right locations

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. Click on **+ New** -> **Data + Storage** -> **Storage account**. You will need an Azure subscription to create an Azure Blob Storage account.
3. Provide a **Name** for the storage account (for e.g., "contoso.core.windows.net") and pick the appropriate selections for **Pricing tier**, **Resource Group** and **Subscription**. Make sure that you have the **Pin to Startboard** option checked. Click **Create**.
4. Go back to the Starboard and click on the storage account that you just created.
5. Under the **Summary** section, click **Containers** and then **+ Add**.
6. Provide a **Name** for the container (for e.g., "b2c") and select **Blob** as the **Access type**. Click **OK**.
7. The container that you created will appear in the list on the **Blobs** blade. Note down the URL of the container; for e.g., it should look like `https://contoso.blob.core.windows.net/b2c`. Close the **Blobs** blade.
8. On the storage account blade, click **Keys** and note down the values of the **Storage Account Name** and **Primary Access Key** fields.

> [AZURE.NOTE]
**Primary Access Key** is an important security credential.

9. Use any one of the [storage explorers](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/03/11/windows-azure-storage-explorers-2014.aspx) listed to upload the [sample content](TBD) files downloaded from github.

> [AZURE.NOTE]
The simplest storage explorer (fully browser-based) to use is [Azure Web Storage Explorer](http://azurestorage.azurewebsites.net/). Note that this project is not maintained by Microsoft, but by an independent developer on github. Click [here](https://github.com/sebagomez/azurestorageexplorer) for more details.

10. Make sure that the content loads as expected; try to access `https://contoso.blob.core.windows.net/b2c/idp.html` on a browser.

### Step 2: Enable CORS on your storage account

1. Open the `App.config` file in the root of the console application project, and enter values for these configuration keys (copied down earlier):
  - For "ida:AccountName", enter your **Storage Account Name**. For e.g., "contoso.core.windows.net".
  - For "ida:AccountKey", enter the **Primary Access Key**.
2. Build the Visual Studio solution and run the application.
3. Use [http://test-cors.org/](http://test-cors.org/) to make sure that your content is now CORS enabled (look for `XHR status: 200` in the result).

### Step 3: Modify the page UI customization options in your sign-up policy

1. Sign in to your directory on the [Azure Portal](https://portal.azure.com) and navigate to the B2C features blade.
2. Click **Sign-up policies** and then click on your sign-up policy (for e.g., "B2C_1_SiIn").
3. Click **Page UI customization** and then **Identity provider selection page**.
4. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter the appropriate URL of the content uploaded to your storage account. For e.g., `https://contoso.blob.core.windows.net/b2c/idp.html`. Click **OK**.
5. Click **Local account sign-up page**. Toggle the **Use custom template** switch to **Yes**. In the **Custom page URI** field, enter the appropriate URL of the content uploaded to your storage account. For e.g., `https://contoso.blob.core.windows.net/b2c/su.html`. Click **OK** twice.
6. Click **Save**.
7. Click the **Run now** command at the top of the blade. Select "B2C app" in the **Applications** drop-down and `https://localhost:44321/` in the **Reply URL / Redirect URI** drop-down. Click the **Run now** button.
8. A new browser tab opens up and you can run through the user experience of signing up for your application with the new content in place!

> [AZURE.NOTE]
Note that it takes up to a minute for your policy changes to take effect.

You can make similar changes to your sign-in and profile editing policies.

## The core UI elements in each type of page

In this section you will find examples of HTML5 fragments (for each type of page) that Azure AD B2C merges into the `<div id="api"></div>` element located in your content. You can use style sheets to customize these UI elements.

> [AZURE.NOTE]
For brevity, only some of the HTML5 code is shown below. Inspect the source code of default pages for more information.

### Identity provider selection page

This page contains a list of identity providers that the user can choose from during sign up or sign in. These are either social identity providers such as Facebook and Google+ or local accounts (email address- or username-based).

```HTML
<div id="api" data-name="IdpSelections">
	<div>
		<ul>
			<li>
				<button class="accountButton" id="FacebookExchange">Facebook</button>
			</li>
			<li>
				<button class="accountButton" id="GoogleExchange">Google+</button>
			</li>
			<li>
				<button class="accountButton" id="SignUpWithLogonEmailExchange">Email</button>
			</li>
		</ul>
	</div>
</div>
```

### Local account sign-up page

This page contains a sign-up form that the user has to fill in when signing up using an email address- or username-based local account. The form can contain different input controls such as text input box, password entry box, radio button, single-select drop-down and multi-select check boxes.

```HTML
<div id="api" data-name="SelfAsserted">
	<p>Create your account by providing the following details</p>
	<div class="attr" id="attributeList">
	<ul>
		<li>
			<div class="attrEntry validate">
				<label>
					Email address
				</label>
				<input id="email" class="textInput" type="text" placeholder=" " required="" autofocus="">
			</div>
		</li>
		<li>
			<div class="attrEntry">
				<label>
					Enter password
				</label>
				<input id="password" class="textInput" type="password" placeholder=" " pattern="..." title="..." required="">
			</div>
		</li>
		<li>
			<div class="attrEntry">
				<label>
					Reenter password
				</label>
				<input id="reenterPassword" class="textInput" type="password" placeholder=" " pattern="..." title=" " required="">
			</div>
		</li>
		<li>
			<div class="attrEntry">
				<label>
					Name
				</label>
				<input id="displayName" class="textInput" type="text" placeholder="Name" required="">
			</div>
		</li>
		<li>
			<div class="attrEntry">
				<label>
					Gender
				</label>
				<input id="extension_Gender_F" name="extension_Gender" type="radio" value="F" autofocus="">
					<label for="extension_Gender_F">
						Female
					</label>
				<input id="extension_Gender_M" name="extension_Gender" type="radio" value="M">
					<label for="extension_Gender_M">
						Male
					</label>
			</div>
		</li>
		<li>
			<div class="attrEntry">
				<label>
					State
				</label>
				<select class="dropdown_single" id="state">
					<option style="display:none" disabled="disabled" value="placeholder" selected="">
						Select
					</option>
					<option value="WA">
						Washington
					</option>
					<option value="NY">
						New York
					</option>
					<option value="CA">
						California
					</option>
				</select>
			</div>
		</li>
		<li>
	</ul>
	<div class="buttons">
		<button id="continue" disabled="">
			Continue
		</button>
		<button id="cancel">
			Cancel
		</button>
	</div>
</div>
```

### Social account sign-up page

This page contains a sign-up form that the user has to fill in when signing up using an existing account from a social identity provider such as Facebook or Google+. This page is similar to the local account sign-up page with the exception of the password entry fields.

### Multi-factor authentication page

This page enables users to verify their phone numbers (using text or voice) during sign up or sign in.

```HTML
<div id="api" data-name="Phonefactor">
	<div id="phonefactor_initial">
		<div class="phoneEntry" id="phoneEntry">
			<div class="phoneNumber">
				<select id="countryCode" style="display:inline-block">
					...
					<option value="+44">United Kingdom (+44)</option>
					<option value="+1" selected="">United States (+1)</option>
				</select>
			</div>
			<div class="phoneNumber">
				<input type="text" id="localNumber" style="display:inline-block" placeholder=" ">
			</div>
		</div>
		<div class="buttons">
			<button id="verifyCode" class="sendInitialCodeButton">Text Me</button>
			<button id="verifyPhone" style="display:inline-block">Call Me</button>
			<button id="cancel" style="display:inline-block">Ask Me Later</button>
		</div>
	</div>
</div>
```

### Error page

TBD.

## Best practices

If you are planning to use the page UI customization feature, please review the following best practices:

- Don't cover Azure AD's default template and attempt to modify it. It is best to build your HTML5 content from scratch.
- For security reasons, we don't allow you to include any JavaScript in your content. Most of what you need should be available out-of-the-box. If not, please use [our forums](Stackoverflow?) to request new functionality.
- Don't duplicate Azure AD's content in your own. This causes JavaScript binding issues during run time.