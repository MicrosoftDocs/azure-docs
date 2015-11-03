<properties 
	pageTitle="Application Insights Data Model" 
	description="Describes properties exported from continuous export in JSON, and used as filters." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/12/2015" 
	ms.author="awills"/>

# Application Insights Export Data Model

This table lists the properties of telemetry sent from the [Application Insights](app-insights-overview.md) SDKs to the portal. 
You'll see these properties in data output from [Continuous Export](app-insights-export-telemetry.md).
They also appear in property filters in [Metric Explorer](app-insights-metrics-explorer.md) and [Diagnostic Search](app-insights-diagnostic-search.md).

There are several [samples](app-insights-export-telemetry.md#code-samples) that illustrate how to use them.

The "&lt;telemetryType&gt;" of the first section is a placeholder for any of the telemetry type names:
view, request, and so on.


## &lt;telemetryType&gt;

**<measurement>**

    KVPs <string, double> <telemetryType>.measurement      Max: 100
* 
     A key value pair (KVP) property bag that provides extensibility on AppInsights telemetry items for adding custom metrics. 

    *Derivation:* measurement names are max size 100 

    *Default:* If existing key, missing value then count = 1, value = 0, min/max = 0 

**<property>**

    KVPs <string, string> <telemetryType>.properties      Max: 100
* 
     A key value pair (KVP) property bag that provides extensibility on AppInsights telemetry items for adding custom properties.  The developer is able to provide a KVP list associated with a telemetry item.  Each key is tracked and a maximum 200 unique keys can be provided per AppInsights ikey (app).  A key can be a max length of 100 characters.  All values are treated as string and a max size of 1000 characters can be provided.  Each property is initially classified as a dimension, enabling segmentation features based on each property's value set.    Each value set is tracked per property key for its cardinality.  When cardinality of a key exceeds 100 unique values, the property is classified as an attribute.  An attribute can be searched but cannot be the target of segmentation (aggregation or group by). 

    *Derivation:* Property Names are max size 100, property values are max size 1024 

    *Default:* If existing key, missing value then value is null 

**count**

    long <telemetryType>.count      
* 
     The count of the telemetry item.   

    *Derivation:* If null, count = 1 

**duration**

    simpleMetric <telemetryType>.duration   ticks   
* 
     The duration of the telemetry item.  For request, this is the execution time of the request. 

    *Default:* R1:  For view, this field is optional 

**message**

    string <telemetrytype>.message      Max: 10240
* 
     A text message on the telemetry type.  This string is available for full text search. 

**name**

    string <telemetrytype>.name      Max: 250
* 
     The Name of the telemetry item.  This name is non-unique across instances and represents a grouping of telemetry types.  For views, this is defaulted to the URLData.base.  For events, this is a developer provided label.  For requests, this is a readable form of the request such as the controller\action. 

    *Examples*<br/> View names:<br/>70-486 Exam Question 1<br/>About - My ASP.NET Application<br/><br/>Example request names:<br/>POST /Components/WebHandlers/ItemCompare.ashx<br/>GET /signalr/poll<br/>GET /signalr/negotiate 

**severity**

    string <telemetryType>.severity      Max: 100
* 
     The severity of the telemetry item.  This is valid for Trace and Exception telemetry items 

**url**

    string <telemetrytype>.url      Max: 2048
* 
     The URL of the pageview, event, request or RDD.  The full URL and is supported in full text search and export. This field can have a very high cardinality and is an attribute.  It is parsed into a set of urlData data items that can be used for aggregations in Metric Explorer. 

    *Default:* R2:  on remotedepencyType, if dependencyType = HTTP this field is required<br/>        on clientperformanceType, this field is required 

    *Examples*<br/> https://icecream.contoso.com/main.aspx?etc=3&extraqs=%3fetc%3d3%26formid%3dc40d07a7-1cf1-4e1d-b00e-e61876d1284e&pagemode=iframe&pagetype=entityrecord<br/>http://fabrikam-oats.azurewebsites.net/index.htm 

**urlData.base**

    string <telemetrytype>.urldata.base      Max: 2048
* 
     A portion of the URL data item excluding host, query parms.  It is the root URI.  This value can be used for segmetnation/aggregation. 

    *Derivation:* See appendix for URL transformation 

    *Examples*<br/> /main.aspx?etc=3&extraqs=%3fetc%3d3%26formid%3dc40d07a7-1cf1-4e1d-b00e-e61876d1284e&pagemode=iframe&pagetype=entityrecord<br/>/default.aspx<br/>/Patients/Search/<br/> 

**urldata.hashTag**

    string <telemetrytype>.urldata.hashtag      Max: 100
* 
     The text of the hashtag of the URL data item 

    *Derivation:* See appendix for URL transformation 

**urlData.host**

    string <telemetrytype>.urldata.host      Max: 200
* 
     The host of the URL data item.  If the URL data item is a local URI, then this is represented as empty 

    *Derivation:* See appendix for URL transformation 

    *Examples*<br/> www.fabrikam.com<br/>www.contoso.com<br/>bretwpc711.azurewebsites.net<br/> 

**urlData.port**

    string <telemetrytype>.urldata.port      Max: 100
* 
     The port of the URL data item, if it is represented on the full URL.  Otherwise, it is empty. 

    *Derivation:* See appendix for URL transformation 

    *Examples*<br/> 80<br/>443 

**urlData.protocol**

    string <telemetrytype>.urldata.protocol      Max: 100
* 
     The protocol (HTTP, FTP, etc.) of the URL data item 

    *Derivation:* See appendix for URL transformation 

    *Examples*<br/> http<br/>https 

**urlData.queryParameters.parameter**

    string <telemetrytype>.urldata.queryparameters.parameter      Max: 100
* 
     An array of the query parameter names of the URL data item 

    *Derivation:* See appendix for URL transformation 

    *Examples*<br/> etc<br/>extraqs<br/>pagemode<br/>pagetype 

**urlData.queryParameters.value**

    string <telemetrytype>.urldata.queryparameters.value      Max: 100
* 
     An array of query parameter's values parsed from the URL data item 

    *Derivation:* See appendix for URL transformation 


## availability

**availability**

    simpleMetric availability.availability      
* 
     An indicator of the success of the availability test 

**dataSize**

    simpleMetric availability.datasize      
* 
     The size of the &lt;telemetry&gt;.message text message 

**result**

    enum (pass/fail) availability.result      
* 
     A pointer (HTTP call) to retrieve the detailed information of the availability web test 

**runLocation**

    string availability.runlocation      Max: 100
* 
     The run location of the availability test 

**testName**

    string availability.testname      Max: 1024
* 
     The name of the availability test 

**testRunId**

    string availability.testrunid      Max: 100
* 
     A unique id for the instance of the availability test run 

**testTimeStamp**

    datetime availability.testtimestamp      
* 
     The timestamp of the beginning of the availability test run instance 


## basicexception

**assembly**

    string basicexception.assembly      Max: 100
**exceptionGroup**

    string basicException.exceptionGroup      
**exceptionType**

    string basicexception.exceptiontype      Max: 100
**failedUserCodeAssembly**

    string basicException.failedUserCodeAssembly      
**failedUserCodeMethod**

    string basicException.failedUserCodeMethod      
**handledAt**

    string basicexception.handledat      Max: 100
**innerMostExceptionMessage**

    string basicException.innermostExceptionMessage      
**innerMostExceptionThrownAtAssembly**

    string basicException.innermostExceptionThrownAtAssembly      
**innerMostExceptionThrownAtMethod**

    string basicException.innermostExceptionThrownAtMethod      
**innerMostExceptionType**

    string basicException.innermostExceptionType      
**method**

    string basicexception.method      Max: 100
**outerMostExceptionMessage**

    string basicException.outerExceptionMessage      
**outerMostExceptionThrownAtAssembly**

    string basicException.outerExceptionThrownAtAssembly      
**outerMostExceptionTrownAtMethod**

    string basicException.outerExceptionThrownAtMethod      
**outerMostExceptionType**

    string basicException.outerExceptionType      
**problemid**

    string basicexception.problemid      Max: 100
* 
    *Derivation:* See appendix for Call Stack parsing 

**Exceptions.Assembly**

    string basicexception.exceptions.assembly      Max: 100
**Exceptions.fileName**

    string basicexception.exceptions.filename      Max: 100
**Exceptions.hasFullStack**

    boolean basicexception.exceptions.hasfullstack      
**Exceptions.Level**

    string basicexception.exceptions.level      Max: 100
**Exceptions.Line**

    long basicexception.exceptions.line      
**exceptions.message**

    string basicexception.exceptions.message      Max: 10240
**Exceptions.Method**

    string basicexception.exceptions.method      Max: 100
**Exceptions.outerId**

    long basicexception.exceptions.outerid      
**Exceptions.parsedStack**

    List<StackFrame> basicexception.exceptions.parsedstack      
**Exceptions.Stack**

    string basicexception.exceptions.stack      Max: 10240
**Exceptions.typeName**

    string basicexception.exceptions.typename      Max: 100
**parsedStackAssembly**

    string basicException.parsedStack.assembly      
**parsedStackFilename**

    string basicException.parsedStack.fileName      
**parsedStackLevel**

    string basicException.parsedStack.level      
**parsedStackLine**

    string basicException.parsedStack.line      
**paseStackMethod**

    string basicException.parsedStack.method      

## clientperformance

**domProcessing**

    simpleMetric clientperformance.domprocessing   ms   
* 
     A portion of the perTotal time.  This portion represents the time the app took to process the response.  For a web client, this is the Document Object Model (DOM) processing time.  This timing is captured using modern browser's perfTiming API. 

**networkConnect**

    simpleMetric clientperformance.networkconnect   ms   
* 
     A portion of the perTotal time.  This portion represents the time the app took to make the network connection.  This timing is captured using modern browser's perfTiming API. 

**perfTotal**

    simpleMetric clientperformance.perftotal   ms   
* 
     The total time of the to load the view.  For web clients, this is equivalent to ""page load time"".  This timing is captured using modern browser's perfTiming API. 

**receiveResponse**

    simpleMetric clientperformance.receiveresponse   ms   
* 
     A portion of the perTotal time.  This portion represents the time the app took to receive the request response.  This timing is captured using modern browser's perfTiming API. 

**sendRequest**

    simpleMetric clientperformance.sendrequest   ms   
* 
     A portion of the perTotal time.  This portion represents the time the app took to send the request to the server.  This timing is captured using modern browser's perfTiming API. 


## context

**applicationBuild**

    string context.application.build      Max: 100
* 
     The application build number of the app 

**applicationVersion**

    string context.application.version      Max: 100
* 
     The application version of the client application 

    *Examples*<br/> 2015.5.21.3<br/>NokiaMailBye_CD_20150227.4 

**telemetryType**

    string context.billing.telemetrytype      Max: 100
* 
     This represents the telemetry type for a billing record and used internal as a segmentation of billable telemetry items for an app 

**dataId**

    string context.data.id      Max: 100
* 
     A unique identifier of the telemetry item.  Assigned at the data collection endpoint. 

    *Derivation:* Generated UUID4 

    *Examples*<br/> edc6eaf3-3459-46a0-bb81-bedc24913864 

**eventTime**

    datetime context.data.eventtime      
* 
     The time of the telemetry event recorded in UTC.  Typically, this is populated at the client.  If this field is missing, it is populated at the data collection endpoint.  The format of the field YYYY-MM-DDTHH:MM:SS.sssZ.    

    *Examples*<br/> 2015-05-20T04:00:46.8338283Z 

**samplingRate**

    string context.data.samplerate      Max: 100
* 
     The sampling rate of the data producer (SDK).  A value here other than 1 signifies that the metrics associated with this telemetry item represent sampled values.  Thus, a sampled rate of 0.05 would result in any 1 telemetry item representing a count of 20. 

**browser**

    string context.device.browser      Max: 100
* 
     The browser of the client 

    *Default:* if null, this is set based on user agent processing.  See appendix for user agent parsing 

    *Examples*<br/> Opera<br/>Mobile Safari<br/>Ovi Browser<br/>Chrome<br/>Firefox<br/>Internet Explorer 

**browserVersion**

    string context.device.browserversion      Max: 100
* 
     The browser version of the client 

    *Default:* if null, this is set based on user agent processing.  See appendix for user agent parsing 

    *Examples*<br/> Opera 12.17<br/>Mobile Safari 8.0<br/>Ovi Browser 5.5<br/>Chrome 37.0<br/>Firefox 21.0<br/>Internet Explorer 7.0 

**deploymentId**

    string context.device.deploymentid      Max: 100
* 
     The deployment id of the server 

**deviceId**

    string context.device.id      Max: 100
* 
     A unique identify of the client.  A generated id and should stored locally on the device and should not be PII such as MAC address or similar non-changeable id.   

**deviceModel**

    string context.device.devicemodel      Max: 100
* 
     The devicemodel for the mobile hardware client 

    *Examples*<br/> Other<br/>iPad<br/>Nokia 503s 

**deviceName**

    string context.device.name      Max: 100
* 
     The name of the device the app is executing on 

**deviceType**

    string context.device.type      Max: 100
* 
     The device type of the client hardware 

    *Examples*<br/> PC<br/>Mobile<br/>Tablet 

**language**

    string context.device.language      Max: 100
* 
     The language of the app on the client.  If not provided explicitly on the telemetry item, it is sourced by processing of the user agent field. 

**locale**

    string context.device.locale      Max: 100
* 
     The local of the app on the client.  If not provided explicitly on the telemetry item, it is sourced by processing of the user agent field. 

    *Examples*<br/> ru<br/>en-US<br/>de-DE<br/>unknown 

**machineName**

    string context.device.vmname      Max: 100
* 
     The machine name of the server.  For virtualized compute, this data item is equivalent to the underlying host.  For dedicated compute, this is the machine name. 

**networkType**

    string context.device.network      Max: 100
* 
     The network type of the client 

**oemName**

    string context.device.oemname      Max: 100
* 
     The oem name for the mobile hardware client 

**operatingSystem**

    string context.device.os      Max: 100
* 
     The operating system of the client 

    *Default:* if null, this is set based on user agent processing.  See appendix for user agent parsing 

    *Examples*<br/> Windows<br/>iOS iPad<br/>Nokia 

**operatingSystemVersion**

    string context.device.osversion      Max: 100
* 
     The operating system version of the client 

    *Default:* if null, this is set based on user agent processing.  See appendix for user agent parsing 

    *Examples*<br/> Windows XP<br/>iOS 8.3<br/>Nokia Series 40<br/>Windows 7<br/>Windows 8 

**roleInstance**

    string context.device.roleinstance      Max: 100
* 
     The instance of server compute.  In a cloud/virtualized scenario, this is the virtual name of the compute instance.  In a dedicated compute instance, this is the machine name.  For Azure Cloud services, this should default to the PaaS role instance name or IaaS virtual machine name  

**roleName**

    string context.device.rolename      Max: 100
* 
     A logical namespace to group server compute instances.  For Azure hosted services, PaaS roles should default to the PaaS role name.  IaaS roles should default to the virtual machine name  

**screenHeight**

    string context.device.screenresolution.height      Max: 100
* 
     The screen height of the app on the client hardware at the time the telemetry item is recorded.  If not explicityl provided it is sourced by a transformation of the screenresolution data item. 

    *Derivation:* Parsed from context.device.screenresolution if present 

    *Examples*<br/> 360<br/>1280<br/>1920 

**screenResolution**

    string context.device.screenresolution      Max: 100
* 
     The screen resolution at the time the telemetry item was captured by the app.  This can switch between a portrait and landscape during the course of a session.  When this attribute is carried to the session level, it is the first screen resolution captured to represent the full session. 

    *Examples*<br/> Screen Resolution Height Width<br/>360X640<br/>1280X800<br/>1920x1080 

**screenWidth**

    string context.device.screenresolution.width      Max: 100
* 
     The screen width of the app on the client hardware at the time the telemetry item is recorded.  If not explicityl provided it is sourced by a transformation of the screenresolution data item. 

    *Derivation:* Parsed from context.device.screenresolution if present 

    *Examples*<br/> 640<br/>800<br/>1080 

**userAgentString**

    string context.device.useragent      Max: 1000
* 
     The useragent of the client browser 

    *Default:* if null, set to the HTTP user agent captured at the data collection endpoint 

    *Examples*<br/> Opera/9.80 (Windows NT 5.1) Presto/2.12.388 Version/12.17<br/>Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4<br/>Chrome/37.0.2062.124 Safari/537.36<br/>Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)<br/>Safari/537.36<br/>+S89 

**aiAgentVersion**

    string context.internal.agentversion      Max: 100
* 
     The internal data item and represents the SDK agent version that produced the telemetry item 

**city**

    string context.location.city      Max: 100
* 
     The city of the app session.  It can be provided directly on the telemetry item.  If it is not present, it is populated based on the IPv4 on the telemetry item.  If there is no IPv4 provided, the field is left empty. 

    *Examples*<br/> Minsk<br/>Haarlem 

**clientIpAddress**

    ipv4 context.location.clientip      
* 
     The IPv4 address of the client in the xxx.xxx.xxx.xxx format.   

    *Default:* if null, set to the HTTP IP captured at the data collection endpoint 

    *Examples*<br/> 0.123.63.143<br/>123.203.131.197 

**continent**

    string context.location.continent      Max: 100
* 
     The continent of the app session.  It can be provided directly on the telemetry item.  If it is not present, it is populated based on the IPv4 on the telemetry item.  If there is no IPv4 provided, the field is left empty. 

    *Examples*<br/> Europe<br/>North America 

**country**

    string context.location.country      Max: 100
* 
     The country of the app session.  It can be provided directly on the telemetry item.  If it is not present, it is populated based on the IPv4 on the telemetry item.  If there is no IPv4 provided, the field is left empty. 

    *Examples*<br/> Belarus<br/>Netherlands<br/>Germany 

**latitude**

    long context.location.point.lat      
* 
    *Examples*<br/> 53.9<br/>45.7788 

**longitude**

    long context.location.point.lon      
* 
    *Examples*<br/> 27.5667<br/>-119.529 

**state**

    string context.location.province      Max: 100
* 
     The province of the app session.  It can be provided directly on the telemetry item.  If it is not present, it is populated based on the IPv4 on the telemetry item.  If there is no IPv4 provided, the field is left empty. 

    *Examples*<br/> Minsk<br/>Oregon<br/>Central Serbia<br/>Provincia di Oristano 

**operationId**

    string context.operation.id      Max: 100
* 
     The operation.id is a correlation id that can be used across telemetry items.  For example, a request id may be populated in the operation.id of all related telemetry items, enabling a correlation across telemetry items such as rdd, exception, events, etc.  

**operationName**

    string context.operation.name      Max: 100
* 
     A human readable operation name.  See operation Id.  This allows a grouping of similar operation ids like Purchase Complete.   

**operationParentId**

     context.operation.parentid      
* 
     A parent id to operation.id, allowing for a nesting of ids for telemetry correlation.   

**syntheticSource**

    string context.data.syntheticsource      Max: 100
* 
     If issynthetic=true, this data item represents the source of the synthetic data. 

    *Default:* if null, user agent is inspected for known synthetic sources (webcrawlers, etc.) and based on this, the source may be set. 

**syntheticTransaction**

    boolean context.data.issynthetic      
* 
     An indicator that the telemetry item was generated due to synthetic tests and not real user activity. 

    *Default:* If null, the user agent is inspected against a known list of synthetic agents.  If a match is found, the value is set to true.<br/>if user agent null, set to false 

**session.Id**

    String context.session.id      Max: 100
* 
     A unique identifier of a real users interaction with an application.  This interaction is a ""session"".  All telemetry that is generated by the application under the same iKey should contain this unique identifier.  <br/><br/>A session is defined by consecutive events within the same user interaction.  A period of more than 30 minutes without a telemetry event signals the end of a session.   

    *Default:* Not valid on MetricType, BillingType 

    *Examples*<br/> CFFC8B21-9828-4F56-AD7C-B6B5AC26B133 

**accountAcquisitionDate**

    datetime context.user.accountAcquisitionDate      
**anonUserId**

    string context.user.anonId      Max: 100
* 
     A unique identifier that defines an anonymous user within the app.  When an SDK is used, this is auto-generated and persisted on the client.  While this doesn't differentiate between real users when sharing a device under the same login.  It does differentiate between real users when using different logins and the OS supports profiles.  It is the best proxy for unique users when there is no authenticated experience. 

    *Examples*<br/> f23854a1b01c4b1fa79fa2d9a5768526 

**anonymousUserAcquisitionDate**

    datetime context.user.anonAcquisitionDate      
**authenticatedUserAcquisitionDate**

    datetime context.user.authAcquisitionDate      
**authUserId**

    string context.user.authId      Max: 100
* 
     A unique identifier that defines an authenticated user within the app.  This is developer provided.  The benefit of an authenticated user is that the identifier may roam across devices within the app and still maintain it's uniqueness. 

**storeRegion**

    string context.user.storeregion      Max: 100
* 
     The store region that the app was sourced from. 

**userAcountId**

    string context.user.accountId      Max: 100
* 
     A unique identifer that defines an account within the app.  This is developer provided. 

### Custom metrics

    context.custom.metrics.<metric-name>

      double value
      double count
      double min
      double max
      double stdDev
      double sampledValue
      double sum


## remotedependency

**async**

    boolean remotedependency.async      
* 
     An indicator if the remote dependency call was asynchronous 

**commandName**

    string remotedependency.commandname      Max: 2048
* 
     The SQL  command name of the remote dependency, if the remote dependency is SQL 

**dependencyTypeName**

    string remotedependency.dependencytypename      Max: 2048
* 
     The remote dependency type name of the remote dependency 

**remoteDependencyName**

    string remotedependency.remotedependencyname      Max: 2048
* 
     The name nf the remote dependency 

    *Derivation:* Standardize to &lt;telemetryType.name&gt; 

**remoteDependencyType**

    string remotedependency.remotedependencytype      Max: 100
* 
     The type of remote dependency.  The types supported are SQL, AZURE Resources (storage, queue, etc.) and HTTP. 

**success**

    boolean remotedependency.success      
* 
     An indicator if the remote dependency call was successful or failed. 


## request

**hasdetaileddata**

    boolean request.hasdetaileddata      
* 
     An indicator that identifies if there are related telemetry items based on the operation.id 

**httpMethod**

    string request.httpmethod      Max: 100
* 
     The HTTP method used on the request.   

**id**

    string request.id      Max: 100
* 
     A unqiue identifier of a request and is generated by the SDK.  This id can be further populated to the operation id property to correlate telemetry items that result from the same request. 

**responseCode**

    long request.responsecode      
* 
     The response code of a request 

**success**

    boolean request.success      
* 
     An indicator if the request is successful.  A response code in the 200s is considered a success. 

    *Default:* If null, set to true 


## sessionmetric

**anonymousUserDurationSinceLastVisit**

    Long sessionmetric.anonymoususerdurationsincelastvisit      
* 
     The time since the last visit by this anonymous user identifier.  On the first visit, this value is empty.  On each subsequent visit it is the time between visits represented in day grain.  A value of 3 means that it has been  3 days from the prior session instance to this session instance 

**anonymousUserSessionCount**

    Long sessionmetric.anonymoususersessioncount      
* 
     The visit count for the anonymous user.  It is an incremental counter of total historical sessions for this unique anonymous user identifier.  Each session by this identifier increments the counter.  This counter is cleared if the user identifier is not seen within a 30 day period, at which point the counter is again reset and the next visit of the user identifer will be considered a new user. 

**authenticatedAccountDurationSinceLastVisit**

    Long sessionmetric.authenticatedaccountdurationsincelastvisit      
* 
     The time since the last visit by this account identifier.  On the first visit, this value is empty.  On each subsequent visit it is the time between visits represented in day grain.  A value of 3 means that it has been  3 days from the prior session instance to this session instance 

**authenticatedAccountSessionCount**

    Long sessionmetric.authenticatedaccountsessioncount      
* 
     The visit count for the authenticaed account identifier.  It is an incremental counter of total historical sessions for this unique account identifier.  Each session by this identifier increments the counter.  This counter is cleared if the user identifier is not seen within a 30 day period, at which point the counter is again reset and the next visit of the user identifer will be considered a new user. 

**authenticatedUserDurationSinceLastVisit**

    Long sessionmetric.authenticateduserdurationsincelastvisit      
* 
     The time since the last visit by this authenticaed user identifier.  On the first visit, this value is empty.  On each subsequent visit it is the time between visits represented in day grain.  A value of 3 means that it has been  3 days from the prior session instance to this session instance 

**authenticatedUserSessionCount**

    Long sessionmetric.authenticatedusersessioncount      
* 
     The visit count for the authenticated user identifier.  It is an incremental counter of total historical sessions for this unique authenticated user identifier.  Each session by this identifier increments the counter.  This counter is cleared if the user identifier is not seen within a 30 day period, at which point the counter is again reset and the next visit of the user identifer will be considered a new user. 

**crashCount**

    Long sessionmetric.crashcount      
* 
     The count of crashes that occurred during this session instance. 

**duration**

    timespan sessionmetric.duration      
* 
     The duration of a session instance 

**entryEvent**

    string sessionmetric.entryevent      Max: 200
* 
     The first event of the session.  This is sourced from the event.name and is available as a segmentation/aggregation for sessionMetric metrics 

    *Derivation:* Sourced from event.name 

**entryUrl**

    string sessionmetric.entryurl      Max: 2048
* 
     The first URL of the session.  This is sourced from the urlData.base and is available as a segmentation/aggregation for sessionMetric metrics 

    *Derivation:* Sourced from &lt;telemetryType&gt;.Url 

**eventCount**

    Long sessionmetric.eventcount      
* 
     The count of events that occurred during this session instance 

**exceptionCount**

    Long sessionmetric.exceptioncount      
* 
     The count of exceptions that occurred during this session instance 

**exitEvent**

    string sessionmetric.exitevent      Max: 200
* 
     The last  event of the session.  This is sourced from the event.name and is available as a segmentation/aggregation for sessionMetric metrics 

    *Derivation:* Sourced from event.name 

**exitUrl**

    string sessionmetric.exiturl      Max: 2048
* 
     The last URL of the session.  This is sourced from the urlData.base and is available as a segmentation/aggregation for sessionMetric metrics 

    *Derivation:* Sourced from &lt;telemetryType&gt;.Url 

**pageBounceCount**

    boolean sessionmetric.pagebouncecount      
* 
     The count of bounce sessions that this sessionMetric telemetry item represents.  A bounce session is a session that is created based on a single view telemetry item. 

    *Derivation:* if sessionMetric.viewCount + sessionMetric.requestCount = 1, then 1 else 0 

**pageCount**

    Long sessionmetric.pagecount      
* 
     The count of views that occurred during this session instance 

**requestCount**

    Long sessionmetric.requestcount      
* 
     The count of requests that occurred during this session instance 

**sessionCount**

    Long sessionmetric.sessioncount      
* 
     A count of sessions that this sessionMetric instance of telemetry represents 


## trace

**context**

    string trace.context      Max: 100
* 
     The context of the capp at time of the trace/exception 

**exception**

    string trace.exception      Max: 10240
* 
     The exception associated with the trace telemetry item 

**excerpt**

    string trace.excerpt      Max: 100
* 
     A short text message of a trace telemetry item 

**formatMessage**

    string trace.formatmessage      Max: 100
* 
     The format message for the trace telemetry item 

**formatProvider**

    string trace.formatprovider      Max: 100
* 
     The format provider for the trace telemetry item 

**hasStackTrace**

    boolean trace.hasstacktrace      
* 
     The indicator if the trace telemetry item includes a stack trace 

**level**

    string trace.level      Max: 100
* 
     The level of the trace message 

**loggerName**

    string trace.loggername      Max: 100
* 
     The trace logger name 

**loggerShortName**

    string trace.loggershortname      Max: 100
* 
     The logger short name 

**message**

    string trace.message      Max: 10240
* 
     The full text message of a trace telemetry item 

**messageId**

    string trace.messageId      Max: 100
* 
     A unique identifier of the trace telemetry item 

**parameters**

    string trace.parameters      Max: 100
* 
     These are the parameters provided to the trace recorder for the trace telemetry item 

**processId**

    string trace.processId      Max: 100
* 
     The process id of the app at the recording of the telemetry item 

**sourceType**

    string trace.sourceType      Max: 100
* 
     The sourcetype of a trace telemetry item 

**sqquenceId**

    string trace.sequenceid      Max: 100
* 
     A sequence identifier that a trace provider may use to record the sequence of the trace telemetry items 

**stacktrace**

    string trace.stacktrace      Max: 100
* 
     A stack trace of captured for the trace telemetry item 

**threadId**

    string trace.threadId      Max: 100
* 
     The threadid of the app at the time of recording the telemetry item 

**userStackframe**

    string trace.userstackframe      Max: 100
* 
     The user stack frame for the trace telemetry item 

**userStackframNum**

    string trace.userstackframenum      Max: 100
* 
     The user stack frame number for the trace telemetry item 


## view

**referrerDataUrl**

    string view.referralurl      Max: 2048
* 
     The referring URL of the pageview.  The full URL and is supported in full text search and export. This field can have a very high cardinality and is an attribute.  It is parsed intl a set of referralData data items that can be used for aggregations in Metric Explorer. 

**referrerData.base**

    string view.referrerdata.base      Max: 2048
* 
     A portion of the referring URL excluding host, query parms.  It is the root URI.  This value can be used for segmetnation/aggregation. 

    *Derivation:* See appendix for URL transformation 

**referrerData.hashTag**

    string view.referrerdata.hashtag      Max: 100
* 
     The text of the hashtag of the referring URL 

    *Derivation:* See appendix for URL transformation 

**referrerData.host**

    string view.referrerdata.host      Max: 200
* 
     The host of the referring URL.  If the URL is a local URI, then this is represented as empty 

    *Derivation:* See appendix for URL transformation 

**referrerData.port**

    string view.referrerdata.port      Max: 100
* 
     The port of the referring URL, if it is represented on the full URL.  Otherwise, it is empty. 

    *Derivation:* See appendix for URL transformation 

**referrerData.protocol**

    string view.referrerdata.protocol      Max: 100
* 
     The protocol (HTTP, FTP, etc.) of the referring URL 

    *Derivation:* See appendix for URL transformation 

    *Examples*<br/> http<br/>https 

**referrerData.queryParameters.parameter**

    string view.referrerdata.queryparameters.parameter      Max: 100
* 
     An array of the query parameter names of the referring URL 

    *Derivation:* See appendix for URL transformation 

**referrerData.queryParameters.value**

    string view.referrerdata.queryparameters.value      Max: 100
* 
     An array of query parameter's values parsed from the referringData URL. 

    *Derivation:* See appendix for URL transformation 



## See also

* [Application Insights](app-insights-overview.md) 
* [Continuous Export](app-insights-export-telemetry.md)
* [Code samples](app-insights-export-telemetry.md#code-samples)


