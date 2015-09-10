<properties
	pageTitle="Azure AD B2C preview | Microsoft Azure"
	description="A topic on the UI customization features in Azure AD B2C"
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

# Azure AD B2C preview: How to customize the UI of pages (and other elements) served by the Azure AD B2C service

User experience is paramount in a consumer-facing application. It is the difference between a good application and a great one, and between merely active users and truly engaged ones. Azure AD B2C allows you to customize user sign up, sign in (*see note below*) and profile editing pages with pixel-perfect control.

> [AZURE.NOTE]
Currently, local account sign-in pages, verification emails and self-service password reset pages are only customizable using the [company branding feature](active-directory-add-company-branding.md).

In this article, you will read about:

- Overview of the page UI customization feature.
- A sample demonstrating the page UI customization feature.
- The core UI elements in each type of page.
- Best practices when exercising this feature.
- Other UI elements that can be customized.

## The page UI customization feature

The page UI customization feature allows you to customize the look-and-feel of your sign up, sign in and profile editing pages (by configuring policies). Your users will have consistent experiences when navigating between your application and pages served by the Azure AD B2C service.

> [AZURE.NOTE]
Policies define interfaces and behaviors that users experience when signing up for, signing into and editing profiles in your application that has been secured by Azure AD B2C.

Unlike other services where options are limited or are only available via APIs, Azure AD B2C uses a different (and simpler) approach to page UI customization. Here's how it works: Azure AD B2C runs code in your user's browser and uses a modern approach called [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/) to load content from a URL that you specify in a policy. You can specify different URLs for different pages. The code merges Azure AD B2C's content (called UI elements) and the content loaded from your URL, and displays the page to your user. All you need to do is create well-formed HTML5 content with a `<div id="api"></div>` element located somewhere in the `<body>` - this is where the Azure AD B2C's content gets merged into. And host this content on an HTTPS endpoint with CORS allowed. You can also fully style Azure AD B2C's UI elements.

This approach allows you to go from the default sign-up page provided by Azure AD B2C (image on the left) to something as delightful (and custom) as the image on the right.

## Sample demonstrating the feature

If you are interested in trying out the page UI customization feature using our sample content, check out [this tutorial](active-directory-b2c-reference-ui-customization-tutorial).

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

## Things to remember when building your own content

If you are planning to use the page UI customization feature, please review the following best practices:

- Don't copy over Azure AD B2C's default template and attempt to modify it. It is best to build your HTML5 content from scratch and to use the default template as reference.
- For security reasons, we don't allow you to include any JavaScript in your content. Most of what you need should be available out-of-the-box. If not, please use [User Voice](http://feedback.azure.com/forums/169401-azure-active-directory) to request new functionality.
- Don't duplicate Azure AD B2C's content in your own. This causes JavaScript binding issues during run time.
- Supported browser versions: TBD.

## Other UI elements that can be customized (independent of your own content pages)

TBD.
Email: Mention about "from:" field
