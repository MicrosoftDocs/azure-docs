---
title: Monitor with multi-step web tests - Azure Application Insights
description: Set up multi-step web tests to monitor your web applications with Azure Application Insights
ms.topic: conceptual
ms.date: 05/26/2020
---

# Multi-step web tests

You can monitor a recorded sequence of URLs and interactions with a website via multi-step web tests. This article will walk you through the process of creating a multi-step web test with Visual Studio Enterprise.

> [!NOTE]
> Multi-step web tests depend on Visual Studio webtest files. It was [announced](https://devblogs.microsoft.com/devops/cloud-based-load-testing-service-eol/) that Visual Studio 2019 will be the last version with webtest functionality. It is important to understand that while no new features will be added, webtest functionality in Visual Studio 2019 is still currently supported and will continue to be supported during the support lifecycle of the product. The Azure Monitor product team has addressed questions regarding the future of multi-step availability tests [here](https://github.com/MicrosoftDocs/azure-docs/issues/26050#issuecomment-468814101).  
> </br>
> Multi-step web tests **are not supported** in the [Azure Government](https://docs.microsoft.com/azure/azure-government/) cloud.


## Pre-requisites

* Visual Studio 2017 Enterprise or greater.
* Visual Studio web performance and load testing tools.

To locate the testing tools pre-requisite. Launch the **Visual Studio Installer** > **Individual components** > **Debugging and testing** > **Web performance and load testing tools**.

![Screenshot of the Visual Studio installer UI with Individual components selected with a checkbox next to the item for Web performance and load testing tools](./media/availability-multistep/web-performance-load-testing.png)

> [!NOTE]
> Multi-step web tests have additional costs associated with them. To learn more consult the [official pricing guide](https://azure.microsoft.com/pricing/details/application-insights/).

## Record a multi-step web test 

> [!WARNING]
> We no longer recommend using the multi-step recorder. The recorder was developed for static HTML pages with basic interactions, and does not provide a functional experience for modern web pages.

For guidance on creating Visual Studio web tests consult the [official Visual Studio 2019 documentation](https://docs.microsoft.com/visualstudio/test/how-to-create-a-web-service-test?view=vs-2019).

## Upload the web test

1. In the Application Insights portal on the Availability pane select **Create Test** > **Test type** > **Multi-step web test**.

2. Set the test locations, frequency, and alert parameters.

### Frequency & location

|Setting| Explanation
|----|----|----|
|**Test frequency**| Sets how often the test is run from each test location. With a default frequency of five minutes and five test locations, your site is tested on average every minute.|
|**Test locations**| Are the places from where our servers send web requests to your URL. **Our minimum number of recommended test locations is five** in order to insure that you can distinguish problems in your website from network issues. You can select up to 16 locations.

### Success criteria

|Setting| Explanation
|----|----|----|
| **Test timeout** |Decrease this value to be alerted about slow responses. The test is counted as a failure if the responses from your site have not been received within this period. If you selected **Parse dependent requests**, then all the images, style files, scripts, and other dependent resources must have been received within this period.|
| **HTTP response** | The returned status code that is counted as a success. 200 is the code that indicates that a normal web page has been returned.|
| **Content match** | A string, like "Welcome!" We test that an exact case-sensitive match occurs in every response. It must be a plain string, without wildcards. Don't forget that if your page content changes you might have to update it. **Only English characters are supported with content match** |

### Alerts

|Setting| Explanation
|----|----|----|
|**Near-realtime (Preview)** | We recommend using Near-realtime alerts. Configuring this type of alert is done after your availability test is created.  |
|**Classic** | We no longer recommended using classic alerts for new availability tests.|
|**Alert location threshold**|We recommend a minimum of 3/5 locations. The optimal relationship between alert location threshold and the number of test locations is **alert location threshold** = **number of test locations - 2, with a minimum of five test locations.**|

## Configuration

### Plugging time and random numbers into your test

Suppose you're testing a tool that gets time-dependent data such as stocks from an external feed. When you record your web test, you have to use specific times, but you set them as parameters of the test, StartTime and EndTime.

![My awesome stock app screenshot](./media/availability-multistep/app-insights-72webtest-parameters.png)

When you run the test, you'd like EndTime always to be the present time, and StartTime should be 15 minutes ago.

The Web Test Date Time Plugin provides the way to handle parameterize times.

1. Add a web test plug-in for each variable parameter value you want. In the web test toolbar, choose **Add Web Test Plugin**.
    
    ![Add Web Test Plug-in](./media/availability-multistep/app-insights-72webtest-plugin-name.png)
    
    In this example, we use two instances of the Date Time Plug-in. One instance is for "15 minutes ago" and another for "now."

2. Open the properties of each plug-in. Give it a name and set it to use the current time. For one of them, set Add Minutes = -15.

    ![Context Parameters](./media/availability-multistep/app-insights-72webtest-plugin-parameters.png)

3. In the web test parameters, use {{plug-in name}} to reference a plug-in name.

    ![StartTime](./media/availability-multistep/app-insights-72webtest-plugins.png)

Now, upload your test to the portal. It will use the dynamic values on every run of the test.

### Dealing with sign-in

If your users sign in to your app, you have various options for simulating sign-in so that you can test pages behind the sign-in. The approach you use depends on the type of security provided by the app.

In all cases, you should create an account in your application just for the purpose of testing. If possible, restrict the permissions of this test account so that there's no possibility of the web tests affecting real users.

**Simple username and password**
Record a web test in the usual way. Delete cookies first.

**SAML authentication**

|Property name| Description|
|----|-----|
| Audience Uri | The audience URI for the SAML token.  This is the URI for the Access Control Service (ACS) – including ACS namespace and host name. |
| Certificate Password | The password for the client certificate which will grant access to the embedded private key. |
| Client Certificate  | The client certificate value with private key in Base64 encoded format. |
| Name Identifier | The name identifier for the token |
| Not After | The timespan for which the token will be valid.  The default is 5 minutes. |
| Not Before | The timespan for which a token created in the past will be valid (to address time skews).  The default is (negative) 5 minutes. |
| Target Context Parameter Name | The context parameter that will receive the generated assertion. |


**Client secret**
If your app has a sign-in route that involves a client secret, use that route. Azure Active Directory (AAD) is an example of a service that provides a client secret sign-in. In AAD, the client secret is the App Key.

Here's a sample web test of an Azure web app using an app key:

![Sample screenshot](./media/availability-multistep/client-secret.png)

Get token from AAD using client secret (AppKey).
Extract bearer token from response.
Call API using bearer token in the authorization header.
Make sure that the web test is an actual client - that is, it has its own app in AAD - and use its clientId + app key. Your service under test also has its own app in AAD: the appID URI of this app is reflected in the web test in the resource field.

### Open Authentication
An example of open authentication is signing in with your Microsoft or Google account. Many apps that use OAuth provide the client secret alternative, so your first tactic should be to investigate that possibility.

If your test must sign in using OAuth, the general approach is:

Use a tool such as Fiddler to examine the traffic between your web browser, the authentication site, and your app.
Perform two or more sign-ins using different machines or browsers, or at long intervals (to allow tokens to expire).
By comparing different sessions, identify the token passed back from the authenticating site, that is then passed to your app server after sign-in.
Record a web test using Visual Studio.
Parameterize the tokens, setting the parameter when the token is returned from the authenticator, and using it in the query to the site. (Visual Studio attempts to parameterize the test, but does not correctly parameterize the tokens.)

## Troubleshooting

Dedicated [troubleshooting article](troubleshoot-availability.md).

## Next steps

* [Availability Alerts](availability-alerts.md)
* [Url ping web tests](monitor-web-app-availability.md)
