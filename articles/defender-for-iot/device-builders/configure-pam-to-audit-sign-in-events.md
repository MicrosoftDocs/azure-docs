---
title: Configure Pluggable Authentication Modules (PAM) to audit sign-in events (Preview)
description: Learn how to configure Pluggable Authentication Modules (PAM) to audit sign-in events when syslog is not configured for your device. 
ms.date: 02/20/2022
ms.topic: how-to
---

# Configure Pluggable Authentication Modules (PAM) to audit sign-in events

This article describes how to configure Pluggable Authentication Modules (PAM) to audit sign-in events. PAM is alternate method for collecting sign-in events when you do not have syslog configured on your device.

For more information, see [Login collector (event-based collector)](concept-event-aggregation.md#login-collector-event-based-collector).

## Prerequisites

Before you get started, make sure that you have the following:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- You must have a Defender for IoT Micro Agent. For more information, see [Tutorial: Install the Defender for IoT micro agent (Preview)](tutorial-standalone-agent-binary-installation.md).

## Modify SSSHD and sign-in service configurations

This procedure describes how to configure logging for successful SSH and Telnet sign-in events.

1. Locate the following files:

    - `/etc/pam.d/sshd`
    - `/etc/pam.d/login`

1. Append the following lines to the end of each file:

    ```bash
    session [default=ignore] pam_exec.so type=open_session /usr/libexec/defender_iot_micro_agent/pam/pam_audit.sh 0

    session [default=ignore] pam_exec.so type=close_session /usr/libexec/defender_iot_micro_agent/pam/pam_audit.sh 1
    ```

## Modify common and system authentication configuration

This procedure describes how to configure logging for authentication failures.

1. <a name="files"></a>Locate one of the following files:

    - `/etc/pam.d/common-auth`
    - `/etc/pam.d/system-auth`

1. Look for the following lines:

    ```bash
    # here are the per-package modules (the "Primary" block)
    auth    [success=1 default=ignore]  pam_unix.so nullok_secure
    # here's the fallback if no module succeeds
    auth    requisite           pam_deny.so
    ```

    This section authenticates via the `pam_unix.so` module. In case of authentication failure, this section continues to the `pam_deny.so` module to prevent access.

    If the [required files](#files) don't exist, look for this code in the files listed in the [the previous procedure](#modify-ssshd-and-sign-in-service-configurations).

1. Replace the indicated lines of code with the following:

    ```bash
    # here are the per-package modules (the "Primary" block)
    auth	[success=1 default=ignore]	pam_unix.so nullok_secure
    auth	[success=1 default=ignore]	pam_exec.so quiet /usr/libexec/defender_iot_micro_agent/pam/pam_audit.sh 2
    auth	[success=1 default=ignore]	pam_echo.so
    # here's the fallback if no module succeeds
    auth	requisite			pam_deny.so
    ```

    If the basic authentication `pam_unix` process success, the process skips to the `pam_echo.so` module, which then skips the `pam_deny.so` and successfully authenticates.

    If the `pam_unix` process fails, the `pam_exec` process reports the sign-in failure to the agent log file, and then jump to the `pam_deny.so` process, which blocks access.

## Validate your configuration

This procedure describes how to verify that you've configured the PAM authentication correctly.

1. Run a successful SSH authentication by signing in and then sign out.

1. Run a failed SSH authentication using a valid username and an invalid password.

1. Access your device and run the following command to open your log file:

    ```bash
    cat /var/lib/defender_iot_micro_agent/pam.log
    ```

1. Verify that lines similar to the following are logged, for a successful sign-in (`open_session`), sign-out (`close_session`), and a sign-in failure (`auth`):

    ```bash
    2021-10-31T18:10:31+02:00,16356631,2589842,open_session,sshd,user,192.168.0.101,ssh,0
    2021-10-31T18:26:19+02:00,16356719,199164,close_session,sshd, user,192.168.0.201,ssh,1
    2021-10-28T17:44:13+03:00,163543223,3572596,auth,sshd,user,143.24.20.36,ssh,2
    ```

1. Repeat this full procedure with Telnet instead of SSH.

## Next steps

For more information, see [Micro agent event collection (Preview)](concept-event-aggregation.md).
