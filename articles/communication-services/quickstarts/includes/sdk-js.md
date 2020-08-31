## JavaScript SDKs

> [!NOTE]
>
> The Communication Services npm packages are not yet released publicly, so you need to [configure vsts-auth to download npm packages from our private feed](https://dev.azure.com/azure-sdk/internal/_packaging?_a=connect&feed=azure-sdk-for-js-pr).

To install the different communication SDKs below, we will be using [NPM](https://www.npmjs.com/) as our package manager for JavaScript.

### Administration SDK
   User management and token generation with necessary permission scopes. Phone management for acquired phone numbers for Communication services.
   
   ```bash
   npm install @azure/communication-administration --save
   ```
- Try Generating User Access Tokens [here](../user-access-tokens.md)

### Common SDK
   Token management SDK including refreshing tokens and procuring user token.
   
   ```bash
   npm install @azure/communication-common --save
   ```

### Chat SDK
   Core Chat SDK which allows applications to start chat clients, create/join thread, send/receive messages and manage run-time chat options.
   
   ```bash
   npm install @azure/communication-chat --save
   ```
- Get Started with Chat [here](../chat/get-started-with-chat.md)

### Calling SDK
   Core Calling SDK which allows applications to start call clients, start/join/end calls, manage run-time calling options.
   
   ```bash
   npm install @azure/communication-calling --save
   ```
- Get Started with Calling [here](../voice-and-video-calling/javascript.md)

### SMS SDK
   Core SMS SDK which allows applications to send/receive SMS messages using Communication Services procured phone numbers as well as integrated Event Grid for delivery reporting.
   
   ```bash
   npm install @azure/communication-sms --save
   ```
- Get Started with SMS [here](../telephony-and-sms/send-sms.md)

### Next steps

For more information, see the following articles:
- Generate User Access Tokens [here](../user-access-tokens.md)
- Get Started with Chat [here](../chat/get-started-with-chat.md)
- Get Started with SMS [here](../telephony-and-sms/send-sms.md)
- Get Started with Calling [here](../voice-and-video-calling/javascript.md)

