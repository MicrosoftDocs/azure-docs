<properties
	pageTitle="Azure Notification Hubs Notify Users for iOS with .NET backend"
	description="Learn how to send push notifications to users in Azure. Code samples written in Objective-C and the .NET API for the backend."
	documentationCenter="ios"
	authors="wesmc7777"
	manager="erikre"
	editor=""
	services="notification-hubs"/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="06/29/2016"
	ms.author="wesmc"/>

#Azure Notification Hubs Notify Users for iOS with .NET backend

[AZURE.INCLUDE [notification-hubs-selector-aspnet-backend-notify-users](../../includes/notification-hubs-selector-aspnet-backend-notify-users.md)]

##Overview

Push notification support in Azure enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms. This tutorial shows you how to use Azure Notification Hubs to send push notifications to a specific app user on a specific device. An ASP.NET WebAPI backend is used to authenticate clients and to generate notifications, as shown in the guidance topic [Registering from your app backend](notification-hubs-registration-management.md#registration-management-from-a-backend).

> [AZURE.NOTE] This tutorial assumes that you have created and configured your notification hub as described in [Getting Started with Notification Hubs (iOS)](notification-hubs-ios-apple-push-notification-apns-get-started.md). This tutorial is also the prerequisite to the [Secure Push (iOS)](notification-hubs-aspnet-backend-ios-push-apple-apns-secure-notification.md) tutorial.
> If you want to use Mobile Apps as your backend service, see the [Mobile Apps Get Started with Push](../app-service-mobile/app-service-mobile-ios-get-started-push.md).



[AZURE.INCLUDE [notification-hubs-aspnet-backend-notifyusers](../../includes/notification-hubs-aspnet-backend-notifyusers.md)]

## Modify your iOS app

1. Open the Single Page view app you created in the [Getting Started with Notification Hubs (iOS)](notification-hubs-ios-apple-push-notification-apns-get-started.md) tutorial.

	> [AZURE.NOTE] In this section we assume that your project is configured with an empty organization name. If not, you will need to prepend your organization name to all class names.

2. In your Main.storyboard add the components shown in the screenshot below from the object library.

    ![][1]

	+ **Username**: A UITextField with placeholder text, *Enter Username*, immediately beneath the send results label and constrained to the left and right margins and beneath the send results label.
	+ **Password**: A UITextField with placeholder text, *Enter Password*, immediately beneath the username text field and constrained to the left and right margins and beneath the username text field. Check the **Secure Text Entry** option in the Attribute Inspector, under *Return Key*.
	+ **Log in**: A UIButton labeled immediately beneath the password text field and uncheck the **Enabled** option in the Attributes Inspector, under *Control-Content*
	+ **WNS**: Label and switch to enable sending the notification Windows Notification Service if it has been setup on the hub. See the [Windows Getting Started](notification-hubs-windows-store-dotnet-get-started.md) tutorial.
	+ **GCM**: Label and switch to enable sending the notification to Google Cloud Messaging if it has been setup on the hub. See [Android Getting Started](notification-hubs-android-get-started.md) tutorial.
	+ **APNS**: Label and switch to enable sending the notification to the Apple Platform Notification Service.
	+ **Recipent Username**:A UITextField with placeholder text, *Recipient username tag*, immediately beneath the GCM label and constrained to the left and right margins and beneath the GCM label.


	Some components were added in the [Getting Started with Notification Hubs (iOS)](notification-hubs-ios-apple-push-notification-apns-get-started.md) tutorial.

3. **Ctrl** drag from the components in the view to ViewController.h and add these new outlets.

	    @property (weak, nonatomic) IBOutlet UITextField *UsernameField;
		@property (weak, nonatomic) IBOutlet UITextField *PasswordField;
		@property (weak, nonatomic) IBOutlet UITextField *RecipientField;
		@property (weak, nonatomic) IBOutlet UITextField *NotificationField;

		// Used to enable the buttons on the UI
		@property (weak, nonatomic) IBOutlet UIButton *LogInButton;
		@property (weak, nonatomic) IBOutlet UIButton *SendNotificationButton;

		// Used to enabled sending notifications across platforms
		@property (weak, nonatomic) IBOutlet UISwitch *WNSSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *GCMSwitch;
		@property (weak, nonatomic) IBOutlet UISwitch *APNSSwitch;

		- (IBAction)LogInAction:(id)sender;

4. In ViewController.h, add the following `#define` just below your import statements. Substitute the *<Enter Your Backend Endpoint\>* placeholder with the Destination URL you used to deploy your app backend in the previous section. For example, *http://you_backend.azurewebsites.net*.

		#define BACKEND_ENDPOINT @"<Enter Your Backend Endpoint>"

4. In your project, create a new **Cocoa Touch class** named **RegisterClient** to interface with the ASP.NET back-end you created. Create the class inheriting from `NSObject`. Then add the following code in the RegisterClient.h.

		@interface RegisterClient : NSObject

		@property (strong, nonatomic) NSString* authenticationHeader;

		-(void) registerWithDeviceToken:(NSData*)token tags:(NSSet*)tags
			andCompletion:(void(^)(NSError*))completion;

		-(instancetype) initWithEndpoint:(NSString*)Endpoint;

		@end

5. In the RegisterClient.m update the `@interface` section:

		@interface RegisterClient ()

		@property (strong, nonatomic) NSURLSession* session;
		@property (strong, nonatomic) NSURLSession* endpoint;

		-(void) tryToRegisterWithDeviceToken:(NSData*)token tags:(NSSet*)tags retry:(BOOL)retry
					andCompletion:(void(^)(NSError*))completion;
		-(void) retrieveOrRequestRegistrationIdWithDeviceToken:(NSString*)token
					completion:(void(^)(NSString*, NSError*))completion;
		-(void) upsertRegistrationWithRegistrationId:(NSString*)registrationId deviceToken:(NSString*)token
					tags:(NSSet*)tags andCompletion:(void(^)(NSURLResponse*, NSError*))completion;

		@end

6. Replace the `@implementation` section in the RegisterClient.m with the following code.


		@implementation RegisterClient

		// Globals used by RegisterClient
		NSString *const RegistrationIdLocalStorageKey = @"RegistrationId";

		-(instancetype) initWithEndpoint:(NSString*)Endpoint
		{
		    self = [super init];
		    if (self) {
		        NSURLSessionConfiguration* config = [NSURLSessionConfiguration defaultSessionConfiguration];
		        _session = [NSURLSession sessionWithConfiguration:config delegate:nil delegateQueue:nil];
				_endpoint = Endpoint;
		    }
		    return self;
		}

		-(void) registerWithDeviceToken:(NSData*)token tags:(NSSet*)tags
					andCompletion:(void(^)(NSError*))completion
		{
		    [self tryToRegisterWithDeviceToken:token tags:tags retry:YES andCompletion:completion];
		}

		-(void) tryToRegisterWithDeviceToken:(NSData*)token tags:(NSSet*)tags retry:(BOOL)retry
					andCompletion:(void(^)(NSError*))completion
		{
		    NSSet* tagsSet = tags?tags:[[NSSet alloc] init];

		    NSString *deviceTokenString = [[token description]
				stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
		    deviceTokenString = [[deviceTokenString stringByReplacingOccurrencesOfString:@" " withString:@""]
									uppercaseString];

		    [self retrieveOrRequestRegistrationIdWithDeviceToken: deviceTokenString
				completion:^(NSString* registrationId, NSError *error) {
		        NSLog(@"regId: %@", registrationId);
		        if (error) {
		            completion(error);
		            return;
		        }

		        [self upsertRegistrationWithRegistrationId:registrationId deviceToken:deviceTokenString
					tags:tagsSet andCompletion:^(NSURLResponse * response, NSError *error) {
		            if (error) {
		                completion(error);
		                return;
		            }

		            NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*)response;
		            if (httpResponse.statusCode == 200) {
		                completion(nil);
		            } else if (httpResponse.statusCode == 410 && retry) {
		                [self tryToRegisterWithDeviceToken:token tags:tags retry:NO andCompletion:completion];
		            } else {
		                NSLog(@"Registration error with response status: %ld", (long)httpResponse.statusCode);

		                completion([NSError errorWithDomain:@"Registration" code:httpResponse.statusCode
									userInfo:nil]);
		            }

		        }];
		    }];
		}

		-(void) upsertRegistrationWithRegistrationId:(NSString*)registrationId deviceToken:(NSData*)token
					tags:(NSSet*)tags andCompletion:(void(^)(NSURLResponse*, NSError*))completion
		{
		    NSDictionary* deviceRegistration = @{@"Platform" : @"apns", @"Handle": token,
													@"Tags": [tags allObjects]};
		    NSData* jsonData = [NSJSONSerialization dataWithJSONObject:deviceRegistration
								options:NSJSONWritingPrettyPrinted error:nil];

		    NSLog(@"JSON registration: %@", [[NSString alloc] initWithData:jsonData
												encoding:NSUTF8StringEncoding]);

		    NSString* endpoint = [NSString stringWithFormat:@"%@/api/register/%@", _endpoint,
									registrationId];
		    NSURL* requestURL = [NSURL URLWithString:endpoint];
		    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:requestURL];
		    [request setHTTPMethod:@"PUT"];
		    [request setHTTPBody:jsonData];
		    NSString* authorizationHeaderValue = [NSString stringWithFormat:@"Basic %@",
													self.authenticationHeader];
		    [request setValue:authorizationHeaderValue forHTTPHeaderField:@"Authorization"];
		    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];

		    NSURLSessionDataTask* dataTask = [self.session dataTaskWithRequest:request
				completionHandler:^(NSData *data, NSURLResponse *response, NSError *error)
			{
		        if (!error)
		        {
		            completion(response, error);
		        }
		        else
		        {
		            NSLog(@"Error request: %@", error);
		            completion(nil, error);
		        }
		    }];
		    [dataTask resume];
		}

		-(void) retrieveOrRequestRegistrationIdWithDeviceToken:(NSString*)token
					completion:(void(^)(NSString*, NSError*))completion
		{
		    NSString* registrationId = [[NSUserDefaults standardUserDefaults]
										objectForKey:RegistrationIdLocalStorageKey];

		    if (registrationId)
		    {
		        completion(registrationId, nil);
		        return;
		    }

		    // request new one & save
		    NSURL* requestURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@/api/register?handle=%@",
									_endpoint, token]];
		    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:requestURL];
		    [request setHTTPMethod:@"POST"];
		    NSString* authorizationHeaderValue = [NSString stringWithFormat:@"Basic %@",
													self.authenticationHeader];
		    [request setValue:authorizationHeaderValue forHTTPHeaderField:@"Authorization"];

		    NSURLSessionDataTask* dataTask = [self.session dataTaskWithRequest:request
				completionHandler:^(NSData *data, NSURLResponse *response, NSError *error)
			{
		        NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*) response;
		        if (!error && httpResponse.statusCode == 200)
		        {
		            NSString* registrationId = [[NSString alloc] initWithData:data
						encoding:NSUTF8StringEncoding];

		            // remove quotes
		            registrationId = [registrationId substringWithRange:NSMakeRange(1,
										[registrationId length]-2)];

		            [[NSUserDefaults standardUserDefaults] setObject:registrationId
						forKey:RegistrationIdLocalStorageKey];
		            [[NSUserDefaults standardUserDefaults] synchronize];

		            completion(registrationId, nil);
		        }
		        else
		        {
		            NSLog(@"Error status: %ld, request: %@", (long)httpResponse.statusCode, error);
		            if (error)
		                completion(nil, error);
		            else {
		                completion(nil, [NSError errorWithDomain:@"Registration" code:httpResponse.statusCode
									userInfo:nil]);
		            }
		        }
		    }];
		    [dataTask resume];
		}

		@end

	The code above implements the logic explained in the guidance article [Registering from your app backend](notification-hubs-registration-management.md#registration-management-from-a-backend) using NSURLSession to perform REST calls to your app backend, and NSUserDefaults to locally store the registrationId returned by the notification hub.

	Note that this class requires its property **authorizationHeader** to be set in order to work properly. This property is set by the **ViewController** class after the log in.

7. In ViewController.h, add a `#import` statement for RegisterClient.h. Then add a declaration for the device token and reference to a `RegisterClient` instance in the `@interface` section:

		#import "RegisterClient.h"

		@property (strong, nonatomic) NSData* deviceToken;
		@property (strong, nonatomic) RegisterClient* registerClient;

8. In ViewController.m, add a private method declaration in the `@interface` section:

		@interface ViewController () <UITextFieldDelegate, NSURLConnectionDataDelegate, NSXMLParserDelegate>

		// create the Authorization header to perform Basic authentication with your app back-end
		-(void) createAndSetAuthenticationHeaderWithUsername:(NSString*)username
						AndPassword:(NSString*)password;

		@end

> [AZURE.NOTE] The following snippet is not a secure authentication scheme, you should substitute the implementation of the **createAndSetAuthenticationHeaderWithUsername:AndPassword:** with your specific authentication mechanism that generates an authentication token to be consumed by the register client class, e.g. OAuth, Active Directory.

9. Then in the `@implementation` section of ViewController.m add the following code which adds the implementation for setting the device token and authentication header.

		-(void) setDeviceToken: (NSData*) deviceToken
		{
		    _deviceToken = deviceToken;
		    self.LogInButton.enabled = YES;
		}

		-(void) createAndSetAuthenticationHeaderWithUsername:(NSString*)username
						AndPassword:(NSString*)password;
		{
		    NSString* headerValue = [NSString stringWithFormat:@"%@:%@", username, password];

		    NSData* encodedData = [[headerValue dataUsingEncoding:NSUTF8StringEncoding] base64EncodedDataWithOptions:NSDataBase64EncodingEndLineWithCarriageReturn];

		    self.registerClient.authenticationHeader = [[NSString alloc] initWithData:encodedData
														encoding:NSUTF8StringEncoding];
		}

		-(BOOL)textFieldShouldReturn:(UITextField *)textField
		{
		    [textField resignFirstResponder];
		    return YES;
		}

	Note how setting the device token enables the log in button. This is becasue as a part of the login action, the view controller registers for push notifications with the app backend. Hence, we do not want Log In action to be accessible till the device token has been properly set up. You can decouple the log in from the push registration as long as the former happens before the latter.

10. In ViewController.m, use the following snippets to implement the action method for your **Log In** button and a method to send the notification message using the ASP.NET backend.

		- (IBAction)LogInAction:(id)sender {
		    // create authentication header and set it in register client
		    NSString* username = self.UsernameField.text;
		    NSString* password = self.PasswordField.text;

		    [self createAndSetAuthenticationHeaderWithUsername:username AndPassword:password];

		    __weak ViewController* selfie = self;
		    [self.registerClient registerWithDeviceToken:self.deviceToken tags:nil
				andCompletion:^(NSError* error) {
		        if (!error) {
		            dispatch_async(dispatch_get_main_queue(),
					^{
		                selfie.SendNotificationButton.enabled = YES;
		                [self MessageBox:@"Success" message:@"Registered successfully!"];
		            });
		        }
		    }];
		}


		- (void)SendNotificationASPNETBackend:(NSString*)pns UsernameTag:(NSString*)usernameTag
					Message:(NSString*)message
		{
		    NSURLSession* session = [NSURLSession
		    	sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:nil
		        delegateQueue:nil];

			// Pass the pns and username tag as parameters with the REST URL to the ASP.NET backend
		    NSURL* requestURL = [NSURL URLWithString:[NSString
				stringWithFormat:@"%@/api/notifications?pns=%@&to_tag=%@", BACKEND_ENDPOINT, pns,
				usernameTag]];

		    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:requestURL];
		    [request setHTTPMethod:@"POST"];

			// Get the mock authenticationheader from the register client
		    NSString* authorizationHeaderValue = [NSString stringWithFormat:@"Basic %@",
				self.registerClient.authenticationHeader];
		    [request setValue:authorizationHeaderValue forHTTPHeaderField:@"Authorization"];

		    //Add the notification message body
		    [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
		    [request setHTTPBody:[message dataUsingEncoding:NSUTF8StringEncoding]];

			// Execute the send notification REST API on the ASP.NET Backend
		    NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request
				completionHandler:^(NSData *data, NSURLResponse *response, NSError *error)
			{
		        NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*) response;
		        if (error || httpResponse.statusCode != 200)
		        {
		            NSString* status = [NSString stringWithFormat:@"Error Status for %@: %d\nError: %@\n",
										pns, httpResponse.statusCode, error];
		            dispatch_async(dispatch_get_main_queue(),
		            ^{
						// Append text because all 3 PNS calls may also have information to view
		                [self.sendResults setText:[self.sendResults.text stringByAppendingString:status]];
		            });
		            NSLog(status);
		        }

		        if (data != NULL)
		        {
		            xmlParser = [[NSXMLParser alloc] initWithData:data];
		            [xmlParser setDelegate:self];
		            [xmlParser parse];
		        }
			}];
		    [dataTask resume];
		}


11. Update the action for the **Send Notification** button to use the ASP.NET backend and send to any PNS enabled by a switch.


		- (IBAction)SendNotificationMessage:(id)sender
		{
		    //[self SendNotificationRESTAPI];
		    [self SendToEnabledPlatforms];
		}


		-(void)SendToEnabledPlatforms
		{
		    NSString* json = [NSString stringWithFormat:@"\"%@\"",self.notificationMessage.text];

			[self.sendResults setText:@""];

		    if ([self.WNSSwitch isOn])
		        [self SendNotificationASPNETBackend:@"wns" UsernameTag:self.RecipientField.text Message:json];

		    if ([self.GCMSwitch isOn])
		        [self SendNotificationASPNETBackend:@"gcm" UsernameTag:self.RecipientField.text Message:json];

		    if ([self.APNSSwitch isOn])
		        [self SendNotificationASPNETBackend:@"apns" UsernameTag:self.RecipientField.text Message:json];
		}



11. In function **ViewDidLoad**, add the following to instantiate the RegisterClient instance and set the delegate for your text fields.

		self.UsernameField.delegate = self;
		self.PasswordField.delegate = self;
		self.RecipientField.delegate = self;
		self.registerClient = [[RegisterClient alloc] initWithEndpoint:BACKEND_ENDPOINT];

12. Now in **AppDelegate.m**, remove all the content of the method **application:didRegisterForPushNotificationWithDeviceToken:** and replace it with the following to make sure that the view controller contains the latest device token retrieved from APNs:

		// Add import to the top of the file
		#import "ViewController.h"

	    - (void)application:(UIApplication *)application
	    			didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
	    {
		    ViewController* rvc = (ViewController*) self.window.rootViewController;
		    rvc.deviceToken = deviceToken;
		}

13. Finally in **AppDelegate.m**, make sure you have the following method:

		- (void)application:(UIApplication *)application didReceiveRemoteNotification: (NSDictionary *)userInfo {
		    NSLog(@"%@", userInfo);
		    [self MessageBox:@"Notification" message:[[userInfo objectForKey:@"aps"] valueForKey:@"alert"]];
		}

## Test the Application

1. In XCode, run the app on a physical iOS device (push notifications will not work in the simulator).

2. In the iOS app UI, enter a username and password. These can be any string, but they must both be the same string value. Then click **Log In**.

	![][2]


3. You should see a pop-up informing you of registration success. Click **OK**.

	![][3]

4. In the **Recipient username tag* text field, enter the user name tag used with the registration from another device.
5. Enter a notification message and click **Send Notification**.  Only the devices that have a registration with the recipient user name tag receive the notification message.  It is only sent to those users.

	![][4]


[1]: ./media/notification-hubs-aspnet-backend-ios-notify-users/notification-hubs-ios-notify-users-interface.png
[2]: ./media/notification-hubs-aspnet-backend-ios-notify-users/notification-hubs-ios-notify-users-enter-user-pwd.png
[3]: ./media/notification-hubs-aspnet-backend-ios-notify-users/notification-hubs-ios-notify-users-registered.png
[4]: ./media/notification-hubs-aspnet-backend-ios-notify-users/notification-hubs-ios-notify-users-enter-msg.png
