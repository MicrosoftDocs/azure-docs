---
title: Release annotations for Application Insights | Microsoft Docs
description: Add deployment or build markers to your metrics explorer charts in Application Insights.
ms.topic: conceptual
ms.date: 07/01/2019

---

# T


## AppAvailabilityResults

Legacy table: availability

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|duration|real|DurationMs|real|
|id|string|Id|string|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|location|string|Location|string|
|message|string|Message|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|size|real|Size|real|
|success|string|Success|Bool|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|



## AppBrowserTimings

Legacy table: browserTimings

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|datetime|
|networkDuration|real|NetworkDurationMs|real|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|processingDuration|real|ProcessingDurationMs|real|
|receiveDuration|real|ReceiveDurationMs|real|
|sdkVersion|string|SdkVersion|string|
|sendDuration|real|SendDurationMs|real|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|totalDuration|real|TotalDurationMs|real|
|url|string|Url|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|



## AppDependencies

Legacy table: dependencies

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|data|string|Data|string|
|duration|real|DurationMs|real|
|id|string|Id|string|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|resultCode|string|ResultCode|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|success|string|Success|Bool|
|target|string|Target|string|
|timestamp|datetime|TimeGenerated|datetime|
|type|string|DependencyType|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|


## AppEvents

Legacy table: customEvents

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|


## AppMetrics

Legacy table: customMetrics

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|iKey|string|IKey|string|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|
|value|real|(removed)||
|valueCount|int|ValueCount|int|
|valueMax|real|ValueMax|real|
|valueMin|real|ValueMin|real|
|valueStdDev|real|ValueStdDev|real|
|valueSum|real|ValueSum|real|


## AppPageViews

Legacy table: pageViews

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|duration|real|DurationMs|real|
|id|string|Id|string|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|url|string|Url|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|


## AppPerformanceCounters

Legacy table: performanceCounters

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|category|string|Category|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|counter|string|(removed)||
|customDimensions|dynamic|Properties|Dynamic|
|iKey|string|IKey|string|
|instance|string|Instance|string|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|name|string|Name|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|
|value|real|Value|real|


## AppRequests

Legacy table: requests

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|Dynamic|
|customMeasurements|dynamic|Measurements|Dynamic|
|duration|real|DurationMs|Real|
|id|string|Id|String|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|String|
|name|string|Name|String|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|performanceBucket|string|PerformanceBucket|String|
|resultCode|string|ResultCode|String|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|source|string|Source|String|
|success|string|Success|Bool|
|timestamp|datetime|TimeGenerated|datetime|
|url|string|Url|String|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|


## AppSystemEvents

Legacy table: exceptions

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|assembly|string|Assembly|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|dynamic|
|customMeasurements|dynamic|Measurements|dynamic|
|details|dynamic|Details|dynamic|
|handledAt|string|HandledAt|string|
|iKey|string|IKey|string|
|innermostAssembly|string|InnermostAssembly|string|
|innermostMessage|string|InnermostMessage|string|
|innermostMethod|string|InnermostMethod|string|
|innermostType|string|InnermostType|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|message|string|Message|string|
|method|string|Method|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|outerAssembly|string|OuterAssembly|string|
|outerMessage|string|OuterMessage|string|
|outerMethod|string|OuterMethod|string|
|outerType|string|OuterType|string|
|problemId|string|ProblemId|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|severityLevel|int|SeverityLevel|int|
|timestamp|datetime|TimeGenerated|datetime|
|type|string|ExceptionType|string|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|


## AppTraces

Legacy table: traces

|ApplicationInsights|Type|LogAnalytics|Type|
|:---|:---|:---|:---|
|appId|string|\_ResourceGUID|string|
|application_Version|string|AppVersion|string|
|appName|string|\_ResourceId|string|
|client_Browser|string|ClientBrowser|string|
|client_City|string|ClientCity|string|
|client_CountryOrRegion|string|ClientCountryOrRegion|string|
|client_IP|string|ClientIP|string|
|client_Model|string|ClientModel|string|
|client_OS|string|ClientOS|string|
|client_StateOrProvince|string|ClientStateOrProvince|string|
|client_Type|string|ClientType|string|
|cloud_RoleInstance|string|AppRoleInstance|string|
|cloud_RoleName|string|AppRoleName|string|
|customDimensions|dynamic|Properties|dynamic|
|customMeasurements|dynamic|Measurements|dynamic|
|iKey|string|IKey|string|
|itemCount|int|ItemCount|int|
|itemId|string|\_ItemId|string|
|itemType|string|Type|string|
|message|string|Message|string|
|operation_Id|string|OperationId|string|
|operation_Name|string|OperationName|string|
|operation_ParentId|string|OperationParentId|string|
|operation_SyntheticSource|string|OperationSyntheticSource|string|
|sdkVersion|string|SdkVersion|string|
|session_Id|string|SessionId|string|
|severityLevel|int|SeverityLevel|int|
|timestamp|datetime|TimeGenerated|datetime|
|user_AccountId|string|UserAccountId|string|
|user_AuthenticatedId|string|UserAuthenticatedId|string|
|user_Id|string|UserId|string|



## Next steps

* [Create work items](../../azure-monitor/app/diagnostic-search.md#create-work-item)
* [Automation with PowerShell](../../azure-monitor/app/powershell.md)