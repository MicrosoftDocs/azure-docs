---
title: include file
description: include file
ms.topic: include
ms.date: 01/23/2020
---

### Create an environment variable

Using your runtime key, and the runtime endpoint, create environment variables for authentication and access:

* `LUIS_RUNTIME_KEY` - The runtime resource key for authenticating your requests.
* `LUIS_RUNTIME_ENDPOINT` - The runtime endpoint associated with your key.
* `LUIS_APP_ID` - The public LUIS IoT app ID is `df67dcdb-c37d-46af-88e1-8b97951ca1c2`.
* `LUIS_APP_SLOT_NAME` - `production` or `staging`

If you intend to use this quickstart to access your own app, you need to take additional steps:
* Create the app and get the app ID
* Assign the runtime key to the app in the LUIS portal
* Test the URL with the browser, that you can access the app

Use the instructions for your operating system.


#### [Windows](#tab/windows)

```console
setx LUIS_PREDICTION_KEY <replace-with-your-resource-key>
setx LUIS_ENDPOINT_NAME <replace-with-your-resource-name>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export LUIS_PREDICTION_KEY=<replace-with-your-resource-key>
export LUIS_ENDPOINT_NAME=<replace-with-your-resource-name>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/macos)

Edit your `.bash_profile`, and add the environment variable:

```bash
export LUIS_PREDICTION_KEY=<replace-with-your-resource-key>
export LUIS_ENDPOINT_NAME=<replace-with-your-resource-name>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.

---