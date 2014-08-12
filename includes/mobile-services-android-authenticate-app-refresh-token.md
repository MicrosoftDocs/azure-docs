
Our token cache should work in a simple case but, what happens when the token expires or is revoked? We need to be able to detect an expired tokens. The token could expire when the app is not running. This would mean the token cache is invalid. The token could also expire while the app is actually running during a call the app makes directly or a call made by the Mobile Services library. The result will be an HTTP status code 401 "Unauthorized". So we need a way to detect this and refresh the token. To do this we use a [ServiceFilter](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/mobileservices/ServiceFilter.html) from the [Android client library](http://dl.windowsazure.com/androiddocs/).

In this section you will define a ServiceFilter that will detect a HTTP status code 401 response and trigger a refresh of the token and the token cache. Additionally, this ServiceFilter will block other outbound requests during authentication so that those requests can use the refreshed token.





1. In Eclipse, open the ToDoActivity.java file and add the following import statements:
 
        import java.util.concurrent.atomic.AtomicBoolean;
 
  
2. In the ToDoActivity.java file, add the following members to the ToDoActivity class. 

    	public boolean bAuthenticating = false;
	    public final Object mAuthenticationLock = new Object();

    These will be used to help synchronize the authentication of the user. We only want to authenticate once. Any calls during an authentication should wait and use the new token from the authentication in progress.

2. In the ToDoActivity.java file, add the following method to the ToDoActivity class that will be used to block outbound calls on other threads while authentication is in progress.

	    /**
    	 * Detects if authentication is in progress and waits for it to complete. 
         * Returns true if authentication was detected as in progress. False otherwise.
    	 */
    	public boolean detectAndWaitForAuthentication()
    	{
    		boolean detected = false;
    		synchronized(mAuthenticationLock)
    		{
    			do
    			{
    				if (bAuthenticating == true)
    					detected = true;
    				try
    				{
    					mAuthenticationLock.wait(1000);
    				}
    				catch(InterruptedException e)
    				{}
    			}
    			while(bAuthenticating == true);
    		}
    		if (bAuthenticating == true)
    			return true;
    		
    		return detected;
    	}
    	

3. In the ToDoActivity.java file, add the following method to the ToDoActivity class. This method will actually trigger the wait and then update the token on outbound requests when authentication is complete. 

    	
    	/**
    	 * Waits for authentication to complete then adds or updates the token 
    	 * in the X-ZUMO-AUTH request header.
    	 * 
    	 * @param request
    	 *            The request that receives the updated token.
    	 */
    	private void waitAndUpdateRequestToken(ServiceFilterRequest request)
    	{
    		MobileServiceUser user = null;
    		if (detectAndWaitForAuthentication())
    		{
    			user = mClient.getCurrentUser();
    			if (user != null)
    			{
    				request.removeHeader("X-ZUMO-AUTH");
    				request.addHeader("X-ZUMO-AUTH", user.getAuthenticationToken());
    			}
    		}
    	}


4. In the ToDoActivity.java file, update the `authenticate` method of the ToDoActivity class so that it accepts a boolean parameter to allow forcing the refresh of the token and token cache. We also need to notify any blocked threads when authentication is completed so they can pick up the new token.

	    /**
    	 * Authenticates with the desired login provider. Also caches the token. 
    	 * 
    	 * If a local token cache is detected, the token cache is used instead of an actual 
	     * login unless bRefresh is set to true forcing a refresh.
    	 * 
	     * @param bRefreshCache
    	 *            Indicates whether to force a token refresh. 
	     */
    	private void authenticate(boolean bRefreshCache) {
	        
		    bAuthenticating = true;
		    
		    if (bRefreshCache || !loadUserTokenCache(mClient))
	        {
	            // New login using the provider and update the token cache.
	            mClient.login(MobileServiceAuthenticationProvider.MicrosoftAccount,
	                    new UserAuthenticationCallback() {
	                        @Override
	                        public void onCompleted(MobileServiceUser user,
	                                Exception exception, ServiceFilterResponse response) {
    
	                    		synchronized(mAuthenticationLock)
	                    		{
		                        	if (exception == null) {
		                                cacheUserToken(mClient.getCurrentUser());
                                        createTable();
		                            } else {
		                                createAndShowDialog(exception.getMessage(), "Login Error");
		                            }
		            				bAuthenticating = false;
		            				mAuthenticationLock.notifyAll();
	                    		}
	                        }
	                    });
	        }
		    else
		    {
		    	// Other threads may be blocked waiting to be notified when 
		    	// authentication is complete.
		    	synchronized(mAuthenticationLock)
		    	{
		    		bAuthenticating = false;
		    		mAuthenticationLock.notifyAll();
		    	}
                createTable();
		    }
	    }   



5. In the ToDoActivity.java file, add the following definition for the `RefreshTokenCacheFilter` class in the ToDoActivity class:

	    /**
    	 * The RefreshTokenCacheFilter class filters responses for HTTP status code 401. 
    	 * When 401 is encountered, the filter calls the authenticate method on the 
    	 * UI thread. Out going requests and retries are blocked during authentication. 
    	 * Once authentication is complete, the token cache is updated and 
    	 * any blocked request will receive the X-ZUMO-AUTH header added or updated to 
    	 * that request.   
    	 */
    	private class RefreshTokenCacheFilter implements ServiceFilter {
    
    		AtomicBoolean mAtomicAuthenticatingFlag = new AtomicBoolean();
    		
    		/**
    		 * The AuthenticationRetryFilterCallback class is a wrapper around the response 
    		 * callback that encapsulates the request and other information needed to enable 
    		 * a retry of the request when HTTP status code 401 is encountered. 
    		 */
    		private class AuthenticationRetryFilterCallback implements ServiceFilterResponseCallback
    		{
    			// Data members used to retry the request during the response.
    			ServiceFilterRequest mRequest;
    			NextServiceFilterCallback mNextServiceFilterCallback;
    			ServiceFilterResponseCallback mResponseCallback;
    
    			public AuthenticationRetryFilterCallback(ServiceFilterRequest request, 
    					NextServiceFilterCallback nextServiceFilterCallback, 
    					ServiceFilterResponseCallback responseCallback)
    			{
    				mRequest = request;
    				mNextServiceFilterCallback = nextServiceFilterCallback;
    				mResponseCallback = responseCallback;
    			}
    			
    			@Override
    			public void onResponse(ServiceFilterResponse response, Exception exception) {
    				
    				// Filter out the 401 responses to update the token cache and 
    				// retry the request
    				if ((response != null) && (response.getStatus().getStatusCode() == 401))
    				{ 
    					// Two simultaneous requests from independent threads could get HTTP 
                        // status 401. Protecting against that right here so multiple 
                        // authentication requests are not setup to run on the UI thread.
    					// We only want to authenticate once. Other requests should just wait 
                        // and retry with the new token.
    					if (mAtomicAuthenticatingFlag.compareAndSet(false, true))							
    					{
    						// Authenticate on UI thread
    						runOnUiThread(new Runnable() {
    							@Override
    							public void run() {
    								// Force a token refresh during authentication.
    								authenticate(true);
    							}
    						});
    					}
    					
    					// Wait for authentication to complete then 
    					// update the token in the request.
    					waitAndUpdateRequestToken(this.mRequest);
    					mAtomicAuthenticatingFlag.set(false);    					
    					    
    					// Retry recursively with a new token as long as we get a 401.
    					mNextServiceFilterCallback.onNext(this.mRequest, this);
    				}
    				
    				// Responses that do not have 401 status codes just pass through.
    				else if (this.mResponseCallback != null)  
                      mResponseCallback.onResponse(response, exception);
    			}
    		}
    		
    		
    		@Override
    		public void handleRequest(final ServiceFilterRequest request, 
				final NextServiceFilterCallback nextServiceFilterCallback,
				ServiceFilterResponseCallback responseCallback) {
    			
	    		// In this example, if authentication is already in progress we block the request
	    		// until authentication is complete to avoid unnecessary authentications as 
	    		// a result of HTTP status code 401. 
	    		// If authentication was detected, add the token to the request.
	    		waitAndUpdateRequestToken(request);
	    
	    		// Wrap the request in a callback object that will facilitate retries.
	    		AuthenticationRetryFilterCallback retryCallbackObject = 
                    new AuthenticationRetryFilterCallback(request, nextServiceFilterCallback,
                          responseCallback); 
				
				// Send the request down the filter chain.
				nextServiceFilterCallback.onNext(request, retryCallbackObject);			
			}
		}

    This service filter will check each response for HTTP status code 401 "Unauthorized". If a 401 is encountered, a new login request to obtain a new token will be setup on the UI thread. Other calls will be blocked until the login is completed. Once the new token is obtained, the request that triggered the 401 will be retried with the new token and any blocked calls will be retried with the new token. 

6. In the ToDoActivity.java file, update `onCreate` method as follows:

		@Override
	    public void onCreate(Bundle savedInstanceState) {
		    super.onCreate(savedInstanceState);
		    
		    setContentView(R.layout.activity_to_do);
		    mProgressBar = (ProgressBar) findViewById(R.id.loadingProgressBar);
        
		    // Initialize the progress bar
		    mProgressBar.setVisibility(ProgressBar.GONE);
        
		    try {
		    	// Create the Mobile Service Client instance, using the provided
		    	// Mobile Service URL and key
		    	mClient = new MobileServiceClient(
		    			"https://<YOUR MOBILE SERVICE>.azure-mobile.net/",
		    			"<YOUR MOBILE SERVICE KEY>", this)
                           .withFilter(new ProgressFilter())
                           .withFilter(new RefreshTokenCacheFilter());
            
		    	// Authenticate passing false to load the current token cache if available.
		    	authenticate(false);
		        	
		    } catch (MalformedURLException e) {
			    createAndShowDialog(new Exception("Error creating the Mobile Service. " +
                     "Verify the URL"), "Error");
		    }
	    }


       In this code the RefreshTokenCacheFilter is used in addition to the ProgressFilter. Also during `onCreate` we want to load the token cache. So false is passed in to the `authenticate` method.