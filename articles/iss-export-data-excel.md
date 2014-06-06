<!--This is a basic template that shows you how to use mark down to create a topic that includes a TOC, sections with subheadings, links to other azure.microsoft.com topics, links to other sites, bold text, italic text, numbered and bulleted lists, code snippets, and images. For fancier markdown, find a published topic and copy the markdown or HTML you want. For more details about using markdown, see http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx.-->

<!--Properties section: this section is required in all topics. Please fill it out!-->
<properties title="required" pageTitle="required" description="required" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Export data from your ISS account to Excel 

This tutorial walks you through two different ways to retrieve device data from the Azure Intelligent Systems Service (ISS) agent. 

<!--please add more information to the introduction here. Think of SEO and someone coming to this topic with absolutely no background on what ISS is-->

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Use Power Query for Excel to retrieve your data]  

+ [Use the REST APIs to retrieve your data]  

+ [Next steps]  

## Prerequisites

To perform the procedures in this tutorial, you will need the following information:

+ Your account name
+ The data endpoint
+ The host for the data endpoint
+ The data secret key
+ The data authorization (base-64 encoded key)

If you did not receive this information, contact your Limited Public Preview Buddy.

The following table shows the sample values used in this lab.

<!--Go to http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx for information about formatting tables. Once the Markdown is converted to HTML, these should render properly.-->


| Connection setting  | Sample value   |  
| :-----------| :-----------|  
| Account name   | TreyResearch  |   
| Data endpoint    | https://treyresearchegress.cloudapp.net/EgressService.svc/   |  
| Host for the data endpoint  | treyresearchegress.cloudapp.net   |   
| Data secret key   | opqrst456789def   |   
| Data authorization <base-64 encoded key   | VHJleVJlc2VhcmNoOm9wcXJzdDQ1Njc4OWRlZg==  | 



## Use Power Query for Excel to retrieve your data 

You can retrieve your data from the service directly through the OData feed on the Data Endpoint. The simplest way to connect to the Odata feed is through Microsoft Power Query for Excel.

Power Query for Excel is an Excel add-in that allows advanced query and filtering options. For more information on Power Query, see [Power BI - Getting Started Guide](http://go.microsoft.com/fwlink/p/?LinkId=394606) or [Microsoft Power Query for Excel Help](http://go.microsoft.com/fwlink/p/?LinkId=401291). To download the Power Query add-in, see [Microsoft Power Query for Excel](http://go.microsoft.com/fwlink/p/?LinkId=401139).

> [WACOM.NOTE] Power Query allows 1,000,000 rows per worksheet or download. If your data table on the service contains more than 1,000,000 rows, use the Data Endpoint REST APIs to retrieve your data.

**To connect to the OData feed from Power Query**

1. In Excel, open the workbook where you want to import your data. 
 
2. In the top ribbon, click **Power Query** > **From Other Sources** > **From ODATA feed**. Power Query launches the **Access an OData feed** wizard.

3. In **URL** on the OData feed, enter the data endpoint for your account. Remember to include the single slash at the end of the URL. 

4. Power Query prompts you to choose an authorization option for the OData feed. In the panel on the left, select **Basic**. Then enter the following information: 

	+ In **Username**, enter your account name. 
	
	+ In **Password**, enter the data secret key.
	
	+ In **Select which URL to apply these settings to**, select the complete URL for the data endpoint. 
	
5. Click **Save**. Power Query will try to connect to the OData feed. If it can’t connect, Power Query displays an error message indicating the reason it can't connect.

6. After it connects to the OData feed, Power Query displays the **Navigator** pane with a list of the available data tables. Select the tables you want, and then click **Edit** or **Load**. 

##Use the REST APIs to retrieve your data

This section explains how you can retrieve your data through the REST APIs. The APIs provide an unattended method of retrieving your data and give you some powerful options for sorting and filtering your data.

All the REST API examples use the sample values for the connection settings. In addition, the examples all use the same values for the following headers.

| Parameter | Sample value |  
|:------------|:------------|  
| Accept (requested format) | application/xml |  
|Content-Length | ### |  
| Content-Type | application/json; charset=utf-8 |  

For a complete reference to all the Data Endpoint APIs, see Data Endpoint REST APIs.
<!--I need to ask Tyson about linking to content that will be on MSDN. Do we just create FWLinks here? -->

> [WACOM.NOTE] To test the APIs in this section, you will need some kind of tool for debugging REST APIs. There are many tools available, but if you are new to REST APIs, you might try Fiddler, a "free web debugging proxy for any browser, system or platform" from Telerik.

###Get a list of available tables

To discover all the data tables that are available on your account, use the GET operation on the Data Endpoint API, using the following structure:
    
    GET https://<Data Endpoint> HTTP/1.1
    Host: <Data Host>
    Accept: <requested format> (optional)
    x-ms-iot-account: <Account Name>
    Authorization: Basic <Data authorization>

> [WACOM.NOTE] You must use single slash after the *<Data Endpoint>*. If your *<Data Endpoint>* does not already end in a slash, be sure to add one.

With our sample values, this request would be:

    GET https://treyresearchegress.cloudapp.net/EgressService.svc/ HTTP/1.1
    Host: treyresearchegress.cloudapp.net
    Accept: application/xml
    x-ms-iot-account: TreyResearch
    Authorization: Basic VHJleVJlc2VhcmNoOmhBNmc0T1dCL096S09obGpSKzV0UUE9PQ==

###Get the column names and data types for all tables

To get a list of all the column names and data types for your tables, use the **GET** operation with the *$metadata* parameter. This request has the following structure:

    GET https://<Data Endpoint>$metadata HTTP/1.1
    Host: <Data Host>
    Accept: <requested format>
    x-ms-iot-account: <Account Name>
    Authorization: Basic <Data authorization>
    
> [WACOM.NOTE] You must use single slash after the *<Data Endpoint>*, before any parameters. If your *<Data Endpoint>* does not already end in a slash, be sure to add one.


Suspendisse volutpat mi id purus ultrices iaculis nec non neque. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Otrus informatus: [Link 1 to another azure.microsoft.com documentation topic]

## Subheading 2

Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio.   

1. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus. 

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
        (NSDictionary *)launchOptions
        {
            // Register for remote notifications
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
            UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            return YES;
        }   	 

2. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia. 

   	    // Because toast alerts don't work when the app is running, the app handles them.
        // This uses the userInfo in the payload to display a UIAlertView.
        - (void)application:(UIApplication *)application didReceiveRemoteNotification:
        (NSDictionary *)userInfo {
            NSLog(@"%@", userInfo);
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
            [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle:
            @"OK" otherButtonTitles:nil, nil];
            [alert show];
        }


    > [WACOM.NOTE] Duis sed diam non <i>nisl molestie</i> pharetra eget a est. [Link 2 to another azure.microsoft.com documentation topic]


Quisque commodo eros vel lectus euismod auctor eget sit amet leo. Proin faucibus suscipit tellus dignissim ultrices.

## Subheading 3
 
1. Maecenas sed condimentum nisi. Suspendisse potenti. 

  + Fusce
  + Malesuada
  + Sem

2. Nullam in massa eu tellus tempus hendrerit.

  	![][7]

3. Quisque felis enim, fermentum ut aliquam nec, pellentesque pulvinar magna.

 


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

<!--Anchors-->
[Use Power Query for Excel to retrieve your data]: #subheading-1
[Use the REST APIs to retrieve your data]: #subheading-2
[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/0-markdown-template-for-new-articles/octocats.png
[6]: ./media/0-markdown-template-for-new-articles/pretty49.png
[7]: ./media/0-markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/