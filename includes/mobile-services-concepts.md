## <a name="what-is"></a>What is Mobile Services

Azure Mobile Services is a highly scalable mobile application development platform that lets you add enhanced functionality to your mobile device apps by using Azure. 

With Mobile Services you can: 

+ **Build native and cross platform apps** - Connect your iOS, Android, Windows, or cross-platform Xamarin or Cordova (Phonegap) apps to your backend mobile service using native SDKs.  
+ **Send push notifications to your users** - Send push notifications to your users of your app.
+ **Authenticate your users** - Leverage popular identity providers like Facebook and Twitter to authenticate your app users.
+ **Store data in the cloud** - Store user data in a SQL Database (by default) or in Mongo DB, DocumentDB, Azure Tables, or Azure Blobs. 
+ **Build offline-ready apps with sync** - Make your apps work offline and use Mobile Services to sync data in the background.
+ **Monitor and scale your apps** - Monitor app usage and scale your backend as demand grows. 

## <a name="concepts"> </a>Mobile Services Concepts

The following are important features and concepts in the Mobile Services:

+ **Application key:** a unique value that is used to limit access to your mobile service from random clients; this "key" is not a security token and is not used to authenticate users of your app.    
+ **Backend:** the mobile service instance that supports your app. A mobile service is implemented either as an ASP.NET Web API project (*.NET backend* ) or as a Node.js project (*JavaScript backend*).
+ **Identity provider:** an external service, trusted by Mobile Services, that authenticates your app's users. Supported providers include: Facebook, Twitter, Google, Microsoft Account, and Azure Active Directory. 
+ **Push notification:** Service-initiated message that is sent to a registered device or user using Azure Notification Hubs.
+ **Scale:** The ability to add, for an additional cost, more processing power, performance, and storage as your app becomes more popular.
+ **Scheduled job:** Custom code that is run either on a pre-determined schedule or on-demand.