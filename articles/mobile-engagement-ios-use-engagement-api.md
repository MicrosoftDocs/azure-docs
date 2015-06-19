<properties 
	pageTitle="How to Use the Engagement API on iOS" 
	description="Latest iOS SDK - How to Use the Engagement API on iOS"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kapiteir" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="01/24/2015" 
	ms.author="kapiteir" />


#How to Use the Engagement API on iOS

This document is an add-on to the document How to Integrate Engagement on iOS: it provides in depth details about how to use the Engagement API to report your application statistics.

Keep in mind that if you only want Engagement to report your application's sessions, activities, crashes and technical information, then the simplest way is to make all your custom `UIViewController` objects inherit from the corresponding `EngagementViewController` class.

If you want to do more, for example if you need to report application specific events, errors and jobs, or if you have to report your application's activities in a different way than the one implemented in the `EngagementViewController` classes, then you need to use the Engagement API.

The Engagement API is provided by the `EngagementAgent` class. An instance of this class can be retrieved by calling the `[EngagementAgent shared]` static method (note that the `EngagementAgent` object returned is a singleton).

Before any API calls, the `EngagementAgent` object must be initialized by calling the method `[EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}"];`

##Engagement concepts

The following parts refine the common [Mobile Engagement Concepts](mobile-engagement-concepts.md) for the iOS platform.

### `Session` and `Activity`

An *activity* is usually associated with one screen of the application, that is to say the *activity* starts when the screen is displayed and stops when the screen is closed: this is the case when the Engagement SDK is integrated by using the `EngagementViewController` classes.

But *activities* can also be controlled manually by using the Engagement API. This allows to split a given screen in several sub parts to get more details about the usage of this screen (for example to known how often and how long dialogs are used inside this screen).

##Reporting Activities

### User starts a new Activity

			[[EngagementAgent shared] startActivity:@"MyUserActivity" extras:nil];

You need to call `startActivity()` each time the user activity changes. The first call to this function starts a new user session.

### User ends his current Activity

			[[EngagementAgent shared] endActivity];

> [AZURE.WARNING] You should **NEVER** call this function by yourself, except if you want to split one use of your application into several sessions: a call to this function would end the current session immediately, so, a subsequent call to `startActivity()` would start a new session. This function is automatically called by the SDK when your application is closed.

##Reporting Events

### Session events

Session events are usually used to report the actions performed by a user during his session.

**Example without extra data:**

			@implementation MyViewController {
			   [...]
			   - (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
			   {
			    [super willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
			        ...
			    [[EngagementAgent shared] sendSessionEvent:@"will_rotate" extras:nil];
			        ...
			   }
			   [...]
			}

**Example with extra data:**

			@implementation MyViewController {
			   [...]
			   - (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
			   {
			    [super willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
			        ...
			    NSMutableDictionary* extras = [NSMutableDictionary dictionary];
			    [extras setObject:[NSNumber numberWithInt:toInterfaceOrientation] forKey:@"to_orientation_id"];
			    [extras setObject:[NSNumber numberWithDouble:duration] forKey:@"duration"];
			    [[EngagementAgent shared] sendSessionEvent:@"will_rotate" extras:extras];
			        ...
			   }
			   [...]
			}

### Standalone events

Contrary to session events, standalone events can be used outside of the context of a session.

**Example:**

			[[EngagementAgent shared] sendEvent:@"received_notification" extras:nil];

##Reporting Errors

### Session errors

Session errors are usually used to report the errors impacting the user during his session.

**Example:**

			/** The user has entered invalid data in a form */
			@implementation MyViewController {
			  [...]
			  -(void)onMyFormSubmitted:(MyForm*)form {
			    [...]
			    /* The user has entered an invalid email address */
			    [[EngagementAgent shared] sendSessionError:@"sign_up_email" extras:nil]
			    [...]
			  }
			  [...]
			}

### Standalone errors

Contrary to session errors, standalone errors can be used outside of the context of a session.

**Example:**

			[[EngagementAgent shared] sendError:@"something_failed" extras:nil];

##Reporting Jobs

**Example:**

Suppose you want to report the duration of your login process:

			[...]
			-(void)signIn 
			{
			  /* Start job */
			  [[EngagementAgent shared] startJob:@"sign_in" extras:nil];
			
			  [... sign in ...]
			
			  /* End job */
			  [[EngagementAgent shared] endJob:@"sign_in"];
			}
			[...]

### Report Errors during a Job

Errors can be related to a running job instead of being related to the current user session.

**Example:**

Suppose you want to report an error during your login process:

			[...]
			-(void)signin
			{
			  /* Start job */
			  [[EngagementAgent shared] startJob:@"sign_in" extras:nil];
			
			  BOOL success = NO;
			  while (!success) {
			    /* Try to sign in */
			    NSError* error = nil;
			    [self trySigin:&error];
			    success = error == nil;
			
			    /* If an error occured report it */
			    if(!success)
			    {
			      [[EngagementAgent shared] sendJobError:@"sign_in_error"
			                     jobName:@"sign_in"
			                      extras:[NSDictionary dictionaryWithObject:[error localizedDescription] forKey:@"error"]];
			
			      /* Retry after a moment */
			      [NSThread sleepForTimeInterval:20];
			    }
			  }
			
			  /* End job */
			  [[EngagementAgent shared] endJob:@"sign_in"];
			};
			[...]

### Events during a job

Events can be related to a running job instead of being related to the current user session.

**Example:**

Suppose we have a social network, and we use a job to report the total time during which the user is connected to the server. The user can receive messages from his friends, this is a job event.

			[...]
			- (void) signin
			{
			  [...Sign in code...]
			  [[EngagementAgent shared] startJob:@"connection" extras:nil];
			}
			[...]
			- (void) signout
			{
			  [...Sign out code...]
			  [[EngagementAgent shared] endJob:@"connection"];
			}
			[...]
			- (void) onMessageReceived 
			{
			  [...Notify user...]
			  [[EngagementAgent shared] sendJobEvent:@"connection" jobName:@"message_received" extras:nil];
			}
			[...]

##Extra parameters

Arbitrary data can be attached to events, errors, activities and jobs.

This data can be structured, it uses iOS's NSDictionary class.

Note that extras can contain `arrays(NSArray, NSMutableArray)`, `numbers(NSNumber class)`, `strings(NSString, NSMutableString)`, `urls(NSURL)`, `data(NSData, NSMutableData)` or other `NSDictionary` instances.

> [AZURE.NOTE] The extra parameter is serialized in JSON. If you want to pass different objects than the ones described above, you must implement the following method in your class:
>
			 -(NSString*)JSONRepresentation; 
>
> The method should return a JSON representation of your object.

### Example

			NSMutableDictionary* extras = [NSMutableDictionary dictionaryWithCapacity:2];
			[extras setObject:[NSNumber numberWithInt:123] forKey:@"video_id"];
			[extras setObject:@"http://foobar.com/blog" forKey:@"ref_click"];
			[[EngagementAgent shared] sendEvent:@"video_clicked" extras:extras];

### Limits

#### Keys

Each key in the `NSDictionary` must match the following regular expression:

`^[a-zA-Z][a-zA-Z_0-9]*`

It means that keys must start with at least one letter, followed by letters, digits or underscores (\_).

#### Size

Extras are limited to **1024** characters per call (once encoded in JSON by the Engagement agent).

In the previous example, the JSON sent to the server is 58 characters long:

			{"ref_click":"http:\/\/foobar.com\/blog","video_id":"123"}

##Reporting Application Information

You can manually report tracking information (or any other application specific information) using the `sendAppInfo:` function.

Note that these information can be sent incrementally: only the latest value for a given key will be kept for a given device.

Like event extras, the `NSDictionary` class is used to abstract application information, note that arrays or sub-dictionaries will be treated as flat strings (using JSON serialization).

**Example:**

			NSMutableDictionary* appInfo = [NSMutableDictionary dictionaryWithCapacity:2];
			[appInfo setObject:@"female" forKey:@"gender"];
			[appInfo setObject:@"1983-12-07" forKey:@"birthdate"]; // December 7th 1983
			[[EngagementAgent shared] sendAppInfo:appInfo];

### Limits

#### Keys

Each key in the `NSDictionary` must match the following regular expression:

`^[a-zA-Z][a-zA-Z_0-9]*`

It means that keys must start with at least one letter, followed by letters, digits or underscores (\_).

#### Size

Application information are limited to **1024** characters per call (once encoded in JSON by the Engagement agent).

In the previous example, the JSON sent to the server is 44 characters long:

			{"birthdate":"1983-12-07","gender":"female"}

