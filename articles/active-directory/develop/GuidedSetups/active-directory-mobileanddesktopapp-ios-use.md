---
title: Azure AD v2 iOS Getting Started - Use | Microsoft Docs
description: How iOS (Swift) applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2017
ms.author: andret

---

## Use the Microsoft Authentication Library (MSAL) to get a token for the Microsoft Graph API

This section shows how to use MSAL to get a token to call the Microsoft Graph API.

1.	Open `ViewController.swift` and replace the code with:

```swift
import UIKit
import MSAL

class ViewController: UIViewController, UITextFieldDelegate, URLSessionDelegate {
    
    let kClientID = "Your_Application_Id_Here"
    let kAuthority = "https://login.microsoftonline.com/common/v2.0"

    let kGraphURI = "https://graph.microsoft.com/v1.0/me/"
    let kScopes: [String] = ["https://graph.microsoft.com/user.read"]
    
    var accessToken = String()
    var applicationContext = MSALPublicClientApplication.init()

    @IBOutlet weak var loggingText: UITextView!
    @IBOutlet weak var signoutButton: UIButton!

     // This button will invoke the call to the Microsoft Graph API. It uses the
     // built in Swift libraries to create a connection.
    
    @IBAction func callGraphButton(_ sender: UIButton) {
        
        
        do {
            
            // We check to see if we have a current logged in user. If we don't, then we need to sign someone in.
            // We throw an interactionRequired so that we trigger the interactive signin.
            
            if  try self.applicationContext.users().isEmpty {
                throw NSError.init(domain: "MSALErrorDomain", code: MSALErrorCode.interactionRequired.rawValue, userInfo: nil)
            } else {
            
            // Acquire a token for an existing user silently
            
            try self.applicationContext.acquireTokenSilent(forScopes: self.kScopes, user: applicationContext.users().first) { (result, error) in
    
                    if error == nil {
                        self.accessToken = (result?.accessToken)!
                        self.loggingText.text = "Refreshing token silently)"
                        self.loggingText.text = "Refreshed Access token is \(self.accessToken)"
                        
                        self.signoutButton.isEnabled = true;
                        self.getContentWithToken()
    
                    } else {
                        self.loggingText.text = "Could not acquire token silently: \(error ?? "No error information" as! Error)"
    
                    }
                }
            }
        }  catch let error as NSError {
            
            // interactionRequired means we need to ask the user to sign-in. This usually happens
            // when the user's Refresh Token is expired or if the user has changed their password
            // among other possible reasons.
            
            if error.code == MSALErrorCode.interactionRequired.rawValue {
                
                self.applicationContext.acquireToken(forScopes: self.kScopes) { (result, error) in
                        if error == nil {
                            self.accessToken = (result?.accessToken)!
                            self.loggingText.text = "Access token is \(self.accessToken)"
                            self.signoutButton.isEnabled = true;
                            self.getContentWithToken()
                            
                        } else  {
                            self.loggingText.text = "Could not acquire token: \(error ?? "No error information" as! Error)"
                        }
                }
                
            }
            
        } catch {
            
            // This is the catch all error.
            
            self.loggingText.text = "Unable to acquire token. Got error: \(error)"
            
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        do {
             // Initialize a MSALPublicClientApplication with a given clientID and authority
            self.applicationContext = try MSALPublicClientApplication.init(clientId: kClientID, authority: kAuthority)
        } catch {
            self.loggingText.text = "Unable to create Application Context. Error: \(error)"
        }
    }


    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        
        if self.accessToken.isEmpty {
            signoutButton.isEnabled = false; 
        }
    }
}
```

<!--start-collapse-->
### More Information
#### Getting a user token interactively
Calling the `AcquireToken` method results in a browser window prompting the user to sign in. Applications usually require a user to sign in interactively the first time they need to access a protected resource, or when a silent operation to acquire a token fails (e.g. the user’s password expired).

#### Getting a user token silently
`AcquireTokenSilent` handles token acquisitions and renewal without any user interaction. After `AcquireToken` is executed for the first time, `AcquireTokenSilent` is the usual method used to obtain tokens used to access protected resources for subsequent calls - as calls to request or renew tokens are made silently.
************
Eventually, `AcquireTokenSilent` will fail – e.g. the user has signed out, or has changed their password on another device. When MSAL detects that the issue can be resolved by requiring an interactive action, it fires an `MSALErrorCode.interactionRequired. `. Your application can handle this exception in two ways:

1.  Make a call against `AcquireToken` immediately, which results in prompting the user to sign-in. This pattern is usually used in online applications where there is no offline content in the application available for the user. The sample generated by this guided setup uses this pattern: you can see it in action the first time you execute the sample: because no user ever used the application, `applicationContext.users().first` will contain a null value, and an ` MSALErrorCode.interactionRequired ` exception will be thrown. The code in the sample then handles the exception by calling `AcquireToken` resulting in prompting the user to sign-in.

2.  Applications can also make a visual indication to the user that an interactive sign-in is required, so the user can select the right time to sign in, or the application can retry `AcquireTokenSilent` at a later time. This is usually used when the user can use other functionality of the application without being disrupted - for example, there is offline content available in the application. In this case, the user can decide when they want to sign in to access the protected resource, or to refresh the outdated information, or your application can decide to retry `AcquireTokenSilent` when network is restored after being unavailable temporarily.

<!--end-collapse-->

## Call the Microsoft Graph API using the token you just obtained

Add the new method below to your ` ViewController.swift`. The method is used to make a `GET` request against Graph API using an Authorize header:
```swift
func getContentWithToken() {
    
    let sessionConfig = URLSessionConfiguration.default
    
    // Specify the Graph API endpoint
    let url = URL(string: kGraphURI)
    var request = URLRequest(url: url!)
    
    // Set the Authorization header for the request. We use Bearer tokens, so we specify Bearer + the token we got from the result
    request.setValue("Bearer \(self.accessToken)", forHTTPHeaderField: "Authorization")
    let urlSession = URLSession(configuration: sessionConfig, delegate: self, delegateQueue: OperationQueue.main)
    
    urlSession.dataTask(with: request) { data, response, error in
        let result = try? JSONSerialization.jsonObject(with: data!, options: [])
                    if result != nil {
                
                self.loggingText.text = result.debugDescription
            }
        }.resume()
}
```

<!--start-collapse-->
### Making a REST call against a protected API

In this sample application, the `getContentWithToken()` method is used to make an HTTP `GET` request against a protected resource that requires a token and then return the content to the caller. This method adds the acquired token in the *HTTP Authorization header*. For this sample, the resource is the Microsoft Graph API *me* endpoint – which displays the user's profile information.
<!--end-collapse-->

## Setup Sign-out

1.1.	Add the following method to your ‘ViewController.swift’ to sign out the user:

```swift 
@IBAction func signoutButton(_ sender: UIButton) {

    do {
        
        // Removes all tokens from the cache for this application for the provided user
        // user:    The user to remove from the cache
        
        try self.applicationContext.remove(self.applicationContext.users().first)
        self.signoutButton.isEnabled = false;
        
    } catch let error {
        self.loggingText.text = "Received error signing user out: \(error)"
    }
}
```
<!--start-collapse-->
### More info on Sign-Out

`signoutButton` removes the user from MSAL user cache – this will effectively tell MSAL to forget the current user so a future request to acquire a token will only succeed if it is made to be interactive.
Although the application in this sample supports a single user, MSAL supports scenarios where multiple accounts can be signed-in at the same time – an example is an email application where a user has multiple accounts.
<!--end-collapse-->

## Register Callback

Once the user authenticates, the browser redirects the user back to the application. Follow the steps below to register this callback:

1.	Open `AppDelegate.swift` and add MSAL import:

```swift
import MSAL
```
<!-- Workaround for Docs conversion bug -->
<ol start="2">
<li>
Add the following method to your AppDelegate class to handle callbacks:
</li>
</ol>

```swift
// @brief Handles inbound URLs. Checks if the URL matches the redirect URI for a pending
// AppAuth authorization request and if so, will look for the code in the response.

func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
    
    print("Received callback!")
    
    MSALPublicClientApplication.handleMSALResponse(url)
    
    return true
}
```

