---
title: Ensuring a user is on a supported browser using Azure Communication Services UI Library
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use Azure Communication Services with the UI Library to create an experience that gets users ready to join a call - Part 1.
author: jamesburnside
manager: alkwa
services: azure-communication-services

ms.author: jaburnsi
ms.date: 11/17/2022
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
---

# Creating a Call Readiness Experience using Azure Communication Services

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

# Overview

In this tutorial, we'll be using Azure Communication Services with the [UI Library](https://aka.ms/acsstorybook) to create an experience that gets users ready to join a call. The UI Library provides a set of rich components and UI controls that can be used to produce a Call Readiness experience, as well as a rich set of APIs to understand the user state.

## Prerequisites

- Follow the App setup process on the previous part of this tutorial: [Call Readiness - Overview](./call-readiness-overview.md)

## Download code

Access the full code for this tutorial on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-call-readiness).

## Checking for Browser Support

To ensure the user gets the best experience, we want to first make sure they're on a [supported browser](../../concepts/voice-video-calling/calling-sdk-features.md#javascript-calling-sdk-support-by-os-and-browser).
In this section, we'll create a page that displays "Preparing your session" whilst we perform a quick support check in the background on the user's browser.

![Gif showing browser check being performed](../media/call-readiness/checking-browser-support.gif)

### Preparing Your Session Page

Create a new file called `PreparingYourSession.tsx` where we'll create a spinner to show to the user while we perform asynchronous checks in the background:

`PreparingYourSession.tsx`

```ts
import { useTheme } from '@azure/communication-react';
import { ISpinnerStyles, IStackStyles, ITextStyles, ITheme, Spinner, Stack, Text } from '@fluentui/react';

export const PreparingYourSession = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: '3rem' }}>
      <Stack styles={spinnerContainerStyles(theme)}>
        <Spinner styles={spinnerStyles} />
      </Stack>
      <Stack horizontalAlign="center">
        <Stack.Item>
          <Text styles={headingStyles} variant="large">
            Preparing your session
          </Text>
        </Stack.Item>
        <Stack.Item>
          <Text variant="medium">Please be patient</Text>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

const headingStyles: ITextStyles = {
  root: {
    fontWeight: '600',
    lineHeight: '2rem'
  }
};

const spinnerStyles: ISpinnerStyles = {
  circle: {
    height: '2.75rem',
    width: '2.75rem',
    borderWidth: '0.2rem'
  }
};

const spinnerContainerStyles = (theme: ITheme): IStackStyles => ({
  root: {
    padding: '1.75rem',
    borderRadius: '50%',
    background: theme.palette?.themeLighterAlt
  }
});
```

We can then hook up this Preparing your session screen into our App.
In the `App.tsx` and a variable `testState` to track the state of the app and while `testState` is in `runningEnvironmentChecks` state we'll show the Preparing Your Session Screen:

lets add these imports to our `App.tsx` file that we created in the overview.
```ts
import { useState } from 'react';
import { PreparingYourSession } from './PreparingYourSession';
```

After that's done, lets update our `App.tsx` file to include the new spinner.

```ts

type TestingState = 'runningEnvironmentChecks' | 'finished';

const App = (): JSX.Element => {
  const [testState, setTestState] = useState<TestingState>('runningEnvironmentChecks');

  return (
    <FluentThemeProvider>
      <CallClientProvider callClient={callClient}>
        {/* Show a Preparing your session screen while running the call readiness checks */}
        {testState === 'runningPreCallChecks' && (
          <>
            <PreparingYourSession />
          </>
        )}

        {/* After the device setup is complete, take the user to the call. For this sample we'll just show a test complete page. */}
        {testState === 'finished' && <TestComplete />}
      </CallClientProvider>
    </FluentThemeProvider>
  );
}
```

### Performing a Environment information check

First create a utility file call `browserSupportUtils.tsx`. Inside this call, we'll add a method `checkBrowserSupport`. This method will use the [Calling Stateful Client](https://azure.github.io/communication-ui-library/?path=/docs/statefulclient-overview--page) to perform a request for the environment information that the Calling Stateful Client is running on.

`EnvironmentSupportUtils.ts`

```ts
import { Features, EnvrionmentInfo } from "@azure/communication-calling";
import { StatefulCallClient } from "@azure/communication-react";

/** Use the callClient's getEnvironmentInfo() method to retrieve the devices environment information. */
export const checkEnvironmentSupport = async (callClient: StatefulCallClient): Promise<EnvironmentInfo> =>
  await callClient.feature(Features.DebugInfo).getEnvironmentInfo();
```
The data that returns from this call is the following:
 - Browser support
 - Browser version support
 - Operating system (Platform) support
 - Detailed environment information

### Informing the user they are on an unsupported browser

Next, we will need to use this information provided from the Calling SDK to inform the user of the state of their environment if there is a issue. The UI library provides three different components to serve this purpose depending on what the issue is.
- `UnsupportedOperatingSystem`
- `UnsupportedBrowser`
- `UnsupportedBrowserVersion`

To do this, we'll host the UI Library's components inside a [FluentUI Modal](https://developer.microsoft.com/fluentui#/controls/web/modal):
Create a new file called `UnsupportedEnvironmentPrompts.tsx` where we'll create the different prompts:

`UnsupportedEnvironmentPrompts.tsx`

```ts
import { UnsupportedOperatingSystem, UnsupportedBrowser, UnsupportedBrowserVersion } from '@azure/communication-react';
import { Modal } from '@fluentui/react';

export const BrowserUnsupportedPrompt = (props: { isOpen: boolean }): JSX.Element => (
  <Modal isOpen={props.isOpen}>
    <UnsupportedBrowser
      onTroubleshootingClick={() => alert('This callback should be used to take the user to further troubleshooting')}
    />
  </Modal>
);

export const OperatingSystemUnsupportedPrompt = (props: { isOpen: boolean }): JSX.Element => (
  <Modal isOpen={props.isOpen}>
    <UnsupportedOperatingSystem
      onTroubleshootingClick={() => alert('This callback should be used to take the user to further troubleshooting')}
    />
  </Modal>
);

export const BrowserVersionUnsupportedPrompt = (props: { isOpen: boolean, onContinueAnyway:() => void }): JSX.    Element => (
  <Modal isOpen={props.isOpen}>
    <UnsupportedBrowserVersion
      onTroubleshootingClick={() => alert('This callback should be used to take the user to further troubleshooting')}
      onContinueAnywayClick={() => props.onContinueAnyway()}
    />
  </Modal>
);

```

We can then show these prompts in a Environment Check Component.
Create a file called `EnvironmentChecksComponent.tsx` that will contain the logic for showing this prompt:
This component will have a callback `onTestsSuccessful` that can take the user to the next page in the App.

`EnvironmentChecksComponent.tsx`

```ts
import { useEffect, useState } from 'react';
import { BrowserUnsupportedPrompt, BrowserVersionUnsupportedPrompt, OperatingSystemUnsupportedPrompt } from './UnsupportedEnvironmentPrompts';
import { useCallClient } from '@azure/communication-react';
import { checkBrowserSupport } from './EnvironmentSupportUtils';

export type EnvironmentChecksState = 'runningEnvironmentChecks' |
  'operatingSystemUnsupported' |
  'browserUnsupported' |
  'browserVersionUnsupported';

/**
 * This component is a demo of how to use the StatefulCallClient with CallReadiness Components to get a user
 * ready to join a call.
 * This component checks the browser support.
 */
export const EnvironmentChecksComponent = (props: {
  /**
   * Callback triggered when the tests are complete and successful
   */
  onTestsSuccessful: () => void
}): JSX.Element => {
  const [currentCheckState, setCurrentCheckState] = useState<EnvironmentChecksState>('runningEnvironmentChecks');
  

  // Run call readiness checks when component mounts
  const callClient = useCallClient();
  useEffect(() => {
    const runCallReadinessChecks = async (): Promise<void> => {

      // First we will get the environment information from the calling SDK.
      const environmentInfo = await checkBrowserSupport(callClient);

      if (!environmentInfo.isSupportedPlatform) {
        setCurrentCheckState('operatingSystemUnsupported');
        // if the platform or operating system is not supported we'll stop here and display a modal to the user.
        return;
      } else if (!environmentInfo.isSupportedBrowser) {
        setCurrentCheckState('browserUnsupported');
        // If browser support fails, we'll stop here and display a modal to the user.
        return;
      } else if (!environmentInfo.isSupportedBrowserVersion) {
        setCurrentCheckState('browserVersionUnsupported');
        /**
         *  if the browser version is unsupported, we'll stop here and show a modal that can allow the user 
         *  to continue into the call.
         */
        return;
      } else {
        props.onTestsSuccessful();
      }
    };

    runCallReadinessChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* We show this when the operating system is unsupported */}
      <OperatingSystemUnsupportedPrompt isOpen={currentCheckState === 'operatingSystemUnsupported'} />

      {/* We show this when the browser is unsupported */}
      <BrowserUnsupportedPrompt isOpen={currentCheckState === 'browserUnsupported'} />

      {/* We show this when the browser version is unsupported */}
      <BrowserVersionUnsupportedPrompt isOpen={currentCheckState === 'browserVersionUnsupported'} onContinueAnyway={props.onTestsSuccessful} />
    </>
  );
}
```

We can then add the `EnvironmentChecksComponent` to the `App.tsx`. The App will then move the user to the _Device Checks_ stage once the test is successful using the `onTestsSuccessful` callback:

Let's now import the new component into our app in `App.tsx`
```ts
import { EnvironmentChecksComponent } from './EnvironmentChecksComponent';
```

Then let's update the `App` component in `App.tsx` like this:

```ts

const App = (): JSX.Element => {
  const [testState, setTestState] = useState<TestingState>('runningPreCallChecks');

  return (
    <FluentThemeProvider>
      <CallClientProvider callClient={callClient}>
        {/* Show a Preparing your session screen while running the call readiness checks */}
        {testState === 'runningPreCallChecks' && (
          <>
            <PreparingYourSession />
            <EnvironmentChecksComponent
              onTestsSuccessful={() => setTestState('finished')}
            />
          </>
        )}

        {/* After the device setup is complete, take the user to the call. For this sample we will just show a test complete page. */}
        {testState === 'finished' && <TestComplete />}
      </CallClientProvider>
    </FluentThemeProvider>
  );
}
```

You can now run the app, if you are in an unsupported browser you'll see the unsupported browser prompt:

![Gif showing browser check failing](../media/call-readiness/browser-support-check-failed.gif)

## Next steps

> [!div class="nextstepaction"]
> [Part 2: Request camera and microphone access](./call-readiness-tutorial-part-2-requesting-device-access.md)
