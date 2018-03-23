2. Hit F5 (or type `vsce up` in the Terminal Window) to run the service. Doing this will automatically run it in our newly selected space `scott`. 
1. We can confirm this by running `vsce list` again. First, you'll notice an instance of `mywebapi` is now running in the `scott` space (the version running in the `mainline` is still running but it is not listed). Secondly, the access point URL for `webfrontend` is prefixed with the text "scott-". This URL is unique to the `scott` space, and signifies that requests sent to the "scott URL" will attempt to first route to services in the `scott` space, and will fall back to services in the `mainline` space.

```
Name         Space     Chart              Ports   Updated     Access Points
-----------  --------  -----------------  ------  ----------  -------------
mywebapi     scott     mywebapi-0.1.0     80/TCP  15s ago     http://localhost:61466
webfrontend  mainline  webfrontend-0.1.0  80/TCP  5h ago      https://scott-webfrontend-contosodev.vsce.io
```

![](../media/common/space-routing.png)

This built-in capability of Connected Environment enables you test code end-to-end in a shared evironment without requiring each developer  to re-create the full stack of services in their space. Note that this routing requires propagation headers to be forwarded in your app code, as illustrated in the previous step of this guide.

## Test code in a space
To test our new version of `mywebapi` in conjunction with `webfrontend`, open your browser to the public access point URL for webfrontend and go to the About page. You should see your new message displayed.

Now, remove the "scott-" part of the URL, and refresh the browser. You should see the old behavior (exhibited by the `mywebapi` version running in `mainline`).