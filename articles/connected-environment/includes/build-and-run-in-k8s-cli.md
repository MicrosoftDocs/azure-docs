## Build and run code in Kubernetes
Let's run our code! In the terminal window, run this command from the **root code folder**, webfrontend:

```cmd
vsce up
```

Keep an eye on the command's output, you'll notice several things as it progresses:
1. Source code is synced to the development environment in Azure.
1. A container image is built in Azure, as specified by the Docker assets in your code folder.
1. Kubernetes objects are created that utilize the container image as specified by the Helm chart in your code folder.
1. Information about the container's endpoint(s) is displayed. In our case, we're expecting a public HTTPS URL.
1. Assuming the above stages complete successfully, you should begin to see `stdout` (and `stderr`) output as the container starts up.

> [!Note]
> These steps will take longer the first time the `up` command is run, but subsequent runs should be quicker.

## Test the web app
Scan the console output for information about the public URL that was created by the `up` command. It will be in the form: 

`Running at public URL: https://<servicename>-<environmentname>.vsce.io` 

Open this URL in a browser window, and you should see the web app load. As the container executes, `stdout` and `stderr` output is streamed to the terminal window.
