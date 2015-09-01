Our token cache should work in a simple case but, what happens when the token expires or is revoked? The token could expire when the app is not running. This would mean the token cache is invalid. The token could also expire while the app is actually running during a call the app makes directly or a call made by the Mobile Services library. The result will be an HTTP status code 401 "Unauthorized". 

We need to be able to detect an expired token, and refresh it. To do this we use a [ServiceFilter](http://dl.windowsazure.com/androiddocs/com/microsoft/windowsazure/mobileservices/ServiceFilter.html) from the [Android client library](http://dl.windowsazure.com/androiddocs/).

In this section you will define a ServiceFilter that will detect a HTTP status code 401 response and trigger a refresh of the token and the token cache. Additionally, this ServiceFilter will block other outbound requests during authentication so that those requests can use the refreshed token.

1. Open the ToDoActivity.java file and add the following import statements:
 
        import java.util.concurrent.atomic.AtomicBoolean;
		import java.util.concurrent.ExecutionException;

		import com.microsoft.windowsazure.mobileservices.MobileServiceException;
 
2. Add the following members to the `ToDoActivity` class. 

    	public boolean bAuthenticating = false;
	    public final Object mAuthenticationLock = new Object();

    These will be used to help synchronize the authentication of the user. We only want to authenticate once. Any calls during an authentication should wait and use the new token from the authentication in progress.

3. In the ToDoActivity.java file, add the following method to the ToDoActivity class that will be used to block outbound calls on other threads while authentication is in progress.

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
    	

4. In the ToDoActivity.java file, add the following method to the ToDoActivity class. This method will actually trigger the wait and then update the token on outbound requests when authentication is complete. 

    	
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


5. In the ToDoActivity.java file, update the `authenticate` method of the ToDoActivity class so that it accepts a boolean parameter to allow forcing the refresh of the token and token cache. We also need to notify any blocked threads when authentication is completed so they can pick up the new token.

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



6. In the ToDoActivity.java file, add this code for a new `RefreshTokenCacheFilter` class inside the ToDoActivity class:

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
	        
	        @Override
	        public ListenableFuture<ServiceFilterResponse> handleRequest(
	        		final ServiceFilterRequest request, 
	        		final NextServiceFilterCallback nextServiceFilterCallback
	        		)
	        {
	            // In this example, if authentication is already in progress we block the request
	            // until authentication is complete to avoid unnecessary authentications as 
	            // a result of HTTP status code 401. 
	            // If authentication was detected, add the token to the request.
	            waitAndUpdateRequestToken(request);
	 
	            // Send the request down the filter chain
	            // retrying up to 5 times on 401 response codes.
	            ListenableFuture<ServiceFilterResponse> future = null;
	            ServiceFilterResponse response = null;
	            int responseCode = 401;
	            for (int i = 0; (i < 5 ) && (responseCode == 401); i++)
	            {
	                future = nextServiceFilterCallback.onNext(request);
	                try {
	                    response = future.get();
	                    responseCode = response.getStatus().getStatusCode();
	                } catch (InterruptedException e) {
	                   e.printStackTrace();
	                } catch (ExecutionException e) {
	                    if (e.getCause().getClass() == MobileServiceException.class)
	                    {
	                        MobileServiceException mEx = (MobileServiceException) e.getCause();
	                        responseCode = mEx.getResponse().getStatus().getStatusCode();
	                        if (responseCode == 401)
	                        {
	                            // Two simultaneous requests from independent threads could get HTTP status 401. 
	                            // Protecting against that right here so multiple authentication requests are
	                            // not setup to run on the UI thread.
	                            // We only want to authenticate once. Requests should just wait and retry 
	                            // with the new token.
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
	
				                // Wait for authentication to complete then update the token in the request. 
				                waitAndUpdateRequestToken(request);
				                mAtomicAuthenticatingFlag.set(false);                                                  
	                        }
	                    }
	                }
	            }
	            return future;
	        }
		}


    This service filter will check each response for HTTP status code 401 "Unauthorized". If a 401 is encountered, a new login request to obtain a new token will be setup on the UI thread. Other calls will be blocked until the login is completed, or until 5 attempts have failed. If the new token is obtained, the request that triggered the 401 will be retried with the new token and any blocked calls will be retried with the new token. 

7. In the ToDoActivity.java file, add this code for a new `ProgressFilter` class inside the ToDoActivity class:
		
		/**
		* The ProgressFilter class renders a progress bar on the screen during the time the App is waiting for the response of a previous request.
		* the filter shows the progress bar on the beginning of the request, and hides it when the response arrived.
		*/
		private class ProgressFilter implements ServiceFilter {
			@Override
			public ListenableFuture<ServiceFilterResponse> handleRequest(ServiceFilterRequest request, NextServiceFilterCallback nextServiceFilterCallback) {

				final SettableFuture<ServiceFilterResponse> resultFuture = SettableFuture.create();

				runOnUiThread(new Runnable() {

					@Override
					public void run() {
						if (mProgressBar != null) mProgressBar.setVisibility(ProgressBar.VISIBLE);
					}
				});

				ListenableFuture<ServiceFilterResponse> future = nextServiceFilterCallback.onNext(request);

				Futures.addCallback(future, new FutureCallback<ServiceFilterResponse>() {
					@Override
					public void onFailure(Throwable e) {
						resultFuture.setException(e);
					}

					@Override
					public void onSuccess(ServiceFilterResponse response) {
						runOnUiThread(new Runnable() {

							@Override
							public void run() {
								if (mProgressBar != null) mProgressBar.setVisibility(ProgressBar.GONE);
							}
						});

						resultFuture.set(response);
					}
				});

				return resultFuture;
			}
		}
		
	This filter will show the progress bar on the beginning of the request and will hide it when the response arrived.

8. In the ToDoActivity.java file, update the `onCreate` method as follows:

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


       In this code, `RefreshTokenCacheFilter` is used in addition to `ProgressFilter`. Also during `onCreate` we want to load the token cache. So `false` is passed in to the `authenticate` method.


