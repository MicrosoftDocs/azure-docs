# Training guide: App registrations in the Azure portal  

We have made lots of improvements to the new and improved [App
registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience in the Azure portal. For those of you that are
comfortable with the legacy experience, we hope this training guide will
help you get started using the new experience.

## Key changes to note
-   App registrations are not limited to being either a **web app/API**
    or a **native** app. The same app registration can be used for all
    of these by registering the respective redirect URIs.

-   The legacy experience supported apps that sign in organizational
    (Azure AD) accounts only. Apps were registered as single-tenant
    (supporting only organizational accounts from the directory the app
    was registered in) and could be modified to be multi-tenant
    (supporting all organizational accounts). The new experience allows
    the registration of apps that can support both those options as well
    as a third option: all organizational accounts as well as personal
    Microsoft accounts.

-   The legacy experience was only available when signed into the Azure
    portal using an organizational account. The new experience can be
    used by personal Microsoft accounts that are not associated with a
    directory.

## List of applications

-   The new app list shows applications that were registered through the
    legacy App registrations experience in the Azure portal (apps that
    sign in Azure AD accounts) as well as apps registered though the
    [Application Registration Portal](https://apps.dev.microsoft.com/)
    (apps that sign in Azure AD and personal Microsoft accounts).

-   The new app list does not have an **Application type** column (since
    a single app registration can be several types) and has two
    additional columns: a **Created on** column and a **Certificates &
    secrets** column which shows the status (current, expiring soon, or
    expired) of credentials that have been registered on the app.

## New app registration

-   In the legacy experience, to register an app you were required to
    provide: **Name**, **Application type**, and **Sign-on URL/Redirect
    URI**. The apps that were created were Azure AD only single-tenant
    applications meaning that they only supported organizational
    accounts from the directory the app was registered in.

-   In the new experience, you are required to provide a **Name** for
    the app and choose the **Supported account types**. You can
    optionally choose to provide a **redirect URI**. If you choose to
    provide one, you also need to specify if this redirect URI is
    web/public (mobile & desktop). For more details on how to register
    an app using the new experience, see [this](quickstart-register-app.md).

## The legacy Properties page

The legacy experience had a **Properties** page which the new experience
does not have. The **Properties** blade had the following fields:
**Name**, **Object ID**, **Application ID**, **App ID URI**, **Logo**,
**Home page URL**, **Logout URL**, **Terms of service URL**, **Privacy
statement URL**, **Application type**, and **Multi-tenant.**

Here is where you can find the equivalent functionality in the new
experience:

-   **Name**, **Logo**, **Home page URL**, **Terms of service URL**, and
    **Privacy statement URL** can now be found on the app's **Branding**
    page.

-   **Object ID** and **Application ID** can now be found on the app's
    **Overview** page.

-   The functionality controlled by the **Multi-tenant** toggle in the
    legacy experience has been replaced by **Supported account types**
    on an app's **Authentication** page. For more details about
    Multi-tenant maps to the Supported account type options, see [this](quickstart-modify-supported-accounts.md).

-   **Logout URL** can be found on the app's **Authentication** page.

-   **Application type** is no longer a valid field. Instead, redirect
    URIs (which can be found on an app's **Authentication** page)
    determine which app types are supported.

-   **App ID URI** can be found on the app's **Expose an API** blade (it
    is **called Application ID URI**). In the legacy experience, this
    property was auto-registered using the following format:
    https://{tenantdomain}/{appID} (e.g.
    <https://microsoft.onmicrosoft.com/aeb4be67-a634-4f20-9a46-e0d4d4f1f96d>).
    In the new format, it is auto-generated as api://{appID}, but needs
    to be explicitly saved.

## Reply URLs/Redirect URls

In the legacy experience, an app had a **Reply URLs** page. In the new
experience, Reply URLs can be found on an app's **Authentication**
section. In addition, they are referred to as **Redirect URIs**. In
addition, The format for redirect URIs has changed. They are required to
be associated with an app type (web or public). In addition, for
security reasons, wildcards and http:// schemes are not supported (with
the exception of http://localhost).

## Keys/Certificates & secrets

In the legacy experience, an app had **Keys** page. In the new
experience, it has been renamed to **Certificates & secrets**. In
addition, **Public keys** are referred to as **Certificates** and
**Passwords** are referred to as **Client secrets.**

## Required permissions/API permissions

-   In the legacy experience, an app had a **Required permissions**
    page. In the new experience, it has been renamed to **API
    permissions**.

-   When selecting an API in the legacy experience, you could choose
    from a small list of Microsoft APIs or search through service
    principals in the tenant. In the new experience, you can choose from
    multiple tabs (**Microsoft APIs**, **APIs my organization uses**, or
    **My APIs**). The search bar on the **APIs my organization** uses
    tab searches through service principals in the tenant. Note: You
    will not see this tab if your application is not associated with a
    tenant.\
    For more details about how to request permissions using the new
    experience, see [this](quickstart-configure-app-access-web-apis.md).

-   The legacy experience had a **Grant permissions** button at the top
    of the **Requested permissions** page. In the new experience, there
    is a **Grant consent** section with a Grant admin consent button on
    an app's **API permissions** section. In addition, there are some
    differences in the ways the buttons function:

    -   In the legacy experience, the logic varied depending on the
        signed in user and the permissions being requested. The logic
        was:

        -   If only user consent-able permissions were being requested
            and the signed in user was not an admin, the user was able
            to grant user consent for the requested permissions.

        -   If at least one permission that requires admin consent was
            being requested and the signed in user was not an admin, the
            user got an error when attempting to grant consent.

        -   If the signed in user was an admin, admin consent was
            granted for all the requested permissions.

    -   In the new experience, only an admin can grant consent. When an
        admin clicks the **Grant admin consent** button, admin consent
        is granted to all the requested permissions.

## Deleting an app registration

In the legacy experience, an app needed to be single tenant in order to
be deleted. The delete button was disabled for multi-tenant apps. In the
new experience, apps can be deleted in any state, but you must confirm
the action. For more details about deleting app registrations, see [this](quickstart-remove-app.md).

## Manifest

The legacy and new experiences use different versions for the format of
the JSON in the manifest editor. For more details, see [this](reference-app-manifest.md).

## New UI
We have also added UI for properties that could previously only be set
using the Manifest editor or the API, or did not exist.

-   **Implicit grant flow** (oauth2AllowImplicitFlow) can be found on an
    app's **Authentication** page. Unlike in the legacy experience, you
    can choose to enable **access tokens** or **id tokens** or both.

-   **Scopes defined by this API** (oauth2Permissions) and **Authorized
    client applications (**preAuthorizedApplications) can be configured
    using an app's **Expose an API** page. For more details on how to
    configure an app to be a web API and expose permissions/scopes, see [this](quickstart-configure-app-expose-web-apis.md).

-   **Publisher domain** (which is displayed to users on the
    [application's consent
    prompt](application-consent-experience.md))
    can be found on an app's **Branding blade** page. For more details
    on how to configure a publisher domain, see [this](howto-configure-publisher-domain).

## Limitations

The new experience has some limitations that will be resolved soon. They
include:

-   The new experience is currently not available in B2C tenants

-   The format of client secrets (app passwords) is different than that
    of the legacy experience and breaks CLI.

-   Changing the value for supported accounts is not supported in the
    UI. Need to use the manifest (unless switching between Azure AD
    single and multi tenant)
