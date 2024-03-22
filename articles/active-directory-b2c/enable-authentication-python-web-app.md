---
title: Enable authentication in your own Python web application using Azure Active Directory B2C
description: This article explains how to enable authentication in your own Python web application using Azure AD B2C
titleSuffix: Azure AD B2C

author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 01/11/2024
ms.author: kengaderdus
ms.subservice: B2C
#Customer intent: As a Python web application developer, I want to enable Azure Active Directory B2C authentication in my application, so that users can sign in, sign out, update their profile, and reset their password using Azure AD B2C user flows.
---

# Enable authentication in your own Python web application using Azure Active Directory B2C

In this article, you'll learn how to add Azure Active Directory B2C (Azure AD B2C) authentication in your own Python web application. You'll enable users to sign in, sign out, update profile and reset password using Azure AD B2C user flows. This article uses [Microsoft Authentication Library (MSAL) for Python](https://github.com/AzureAD/microsoft-authentication-library-for-python/tree/main) to simplify adding authentication to your Python web application.

The aim of this article is to substitute the sample application you used in [Configure authentication in a sample Python web application by using Azure AD B2C](configure-authentication-sample-python-web-app.md) with your own Python application.

This article uses [Python 3.9+](https://www.python.org/) and [Flask 2.1](https://flask.palletsprojects.com/en/2.1.x/) to create a basic web app. The application's views uses [Jinja2 templates](https://flask.palletsprojects.com/en/2.1.x/templating/).

## Prerequisites

- Complete the steps in [Configure authentication in a sample Python web application by using Azure AD B2C](configure-authentication-sample-python-web-app.md). You'll create Azure AD B2C user flows and register a web application in Azure portal.
- Install [Python](https://www.python.org/downloads/) 3.9 or above
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor
- Install the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code

## Step 1: Create the Python project

1. On your file system, create a project folder for this tutorial, such as  `my-python-web-app`.
1. In your terminal, change directory into your Python app folder, such as `cd my-python-web-app`.
1. Run the following command to create and activate a virtual environment named `.venv` based on your current interpreter.

    # [Linux](#tab/linux)

    ```bash
    sudo apt-get install python3-venv  # If needed
    python3 -m venv .venv
    source .venv/bin/activate
    ```

    # [macOS](#tab/macos)

    ```zsh
    python3 -m venv .venv
    source .venv/bin/activate
    ```

    # [Windows](#tab/windows)

    ```cmd
    py -3 -m venv .venv
    .venv\scripts\activate
    ```
    ---

1. Update pip in the virtual environment by running the following command in the terminal:

    ```
    python -m pip install --upgrade pip
    ```

1. To enable the Flask debug features, switch Flask to the development environment to `development` mode. For more information about debugging Flask apps, check out the [Flask documentation](https://flask.palletsprojects.com/en/2.1.x/config/#environment-and-debug-features).

    # [Linux](#tab/linux)

    ```bash
    export FLASK_ENV=development
    ```

    # [macOS](#tab/macos)

    ```zsh
    export FLASK_ENV=development
    ```

    # [Windows](#tab/windows)

    ```cmd
    set FLASK_ENV=development
    ```
    ---

1. Open the project folder in VS Code by running the `code .` command, or by opening VS Code and selecting the **File** > **Open Folder**.


## Step 2: Install app dependencies

Under your web app root folder, create the `requirements.txt` file. The requirements file [lists the packages](https://pip.pypa.io/en/stable/user_guide/) to be installed using pip install.  Add the following content to the requirements.txt file:


```
Flask>=2
werkzeug>=2

flask-session>=0.3.2,<0.5
requests>=2,<3
msal>=1.7,<2
```

In your terminal, install the dependencies by running the following commands:

# [Linux](#tab/linux)

```bash
python -m pip install -r requirements.txt
```

# [macOS](#tab/macos)

```zsh
python -m pip install -r requirements.txt
```

# [Windows](#tab/windows)

```cmd
py -m pip install -r requirements.txt
```

---

## Step 3: Build app UI components

Flask is a lightweight Python framework for web applications that provides the basics for URL routing and page rendering. It leverages Jinja2 as its template engine to render the content of your app. For more information, check out the [template designer documentation](https://jinja.palletsprojects.com/en/3.1.x/templates/). In this section, you add the required templates that provide the basic functionality of your web app.

### Step 3.1 Create a base template

A base page template in Flask contains all the shared parts of a set of pages, including references to CSS files, script files, and so forth. Base templates also define one or more block tags that other templates that extend the base are expected to override. A block tag is delineated by `{% block <name> %}` and `{% endblock %}` in both the base template and the extended template.


In the root folder of your web app, create the `templates` folder. In the templates folder, create a file named `base.html`, and then add the contents below:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    {% block metadata %}{% endblock %}

    <title>{% block title %}{% endblock %}</title>
    <!-- Bootstrap CSS file reference -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="{{ url_for('index')}}">Python Flask demo</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="{{ url_for('index')}}">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ url_for('graphcall')}}">Graph API</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container body-content">
        <br />
        {% block content %}
        {% endblock %}

        <hr />
        <footer>
            <p>Powered by MSAL Python {{ version }}</p>
        </footer>
    </div>
</body>

</html>
```

### Step 3.2 Create the web app templates

Add the following templates under the templates folder. These templates extend the `base.html` template:

- **index.html**: the home page of the web app. The templates use the following logic: if a user doesn't sign in, it renders the sign-in button. If a user signs in, it renders the access token's claims, link to edit profile, and call a Graph API.

    ```html
    {% extends "base.html" %}
    {% block title %}Home{% endblock %}
    {% block content %}

    <h1>Microsoft Identity Python Web App</h1>

    {% if user %}
    <h2>Claims:</h2>
    <pre>{{ user |tojson(indent=4) }}</pre>


    {% if config.get("ENDPOINT") %}
    <li><a href='/graphcall'>Call Microsoft Graph API</a></li>
    {% endif %}

    {% if config.get("B2C_PROFILE_AUTHORITY") %}
    <li><a href='{{_build_auth_code_flow(authority=config["B2C_PROFILE_AUTHORITY"])["auth_uri"]}}'>Edit Profile</a></li>
    {% endif %}

    <li><a href="/logout">Logout</a></li>

    {% else %}
    <li><a href='{{ auth_url }}'>Sign In</a></li>
    {% endif %}

    {% endblock %}
    ```

- **graph.html**: Demonstrates how to call a REST API.

    ```html
    {% extends "base.html" %}
    {% block title %}Graph API{% endblock %}
    {% block content %}
    <a href="javascript:window.history.go(-1)">Back</a>
    <!-- Displayed on top of a potentially large JSON response, so it will remain visible -->
    <h1>Graph API Call Result</h1>
    <pre>{{ result |tojson(indent=4) }}</pre> <!-- Just a generic json viewer -->
    {% endblock %}
    ```

- **auth_error.html**: Handles authentication errors.

    ```html
    {% extends "base.html" %}
    {% block title%}Error{% endblock%}

    {% block metadata %}
    {% if config.get("B2C_RESET_PASSWORD_AUTHORITY") and "AADB2C90118" in result.get("error_description") %}
    <!-- See also https://learn.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-policies#linking-user-flows -->
    <meta http-equiv="refresh"
      content='0;{{_build_auth_code_flow(authority=config["B2C_RESET_PASSWORD_AUTHORITY"])["auth_uri"]}}'>
    {% endif %}
    {% endblock %}

    {% block content %}
    <h2>Login Failure</h2>
    <dl>
      <dt>{{ result.get("error") }}</dt>
      <dd>{{ result.get("error_description") }}</dd>
    </dl>

    <a href="{{ url_for('index') }}">Homepage</a>
    {% endblock %}
    ```

## Step 4: Configure your web app

In the root folder of your web app, create a file named `app_config.py`. This file contains information about your Azure AD B2C identity provider. The web app uses this information to establish a trust relationship with Azure AD B2C, sign users in and out, acquire tokens, and validate them. Add the following contents into the file:

```python
import os

b2c_tenant = "fabrikamb2c"
signupsignin_user_flow = "B2C_1_signupsignin1"
editprofile_user_flow = "B2C_1_profileediting1"

resetpassword_user_flow = "B2C_1_passwordreset1"  # Note: Legacy setting.

authority_template = "https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{user_flow}"

CLIENT_ID = "Enter_the_Application_Id_here" # Application (client) ID of app registration

CLIENT_SECRET = "Enter_the_Client_Secret_Here" # Application secret.

AUTHORITY = authority_template.format(
    tenant=b2c_tenant, user_flow=signupsignin_user_flow)
B2C_PROFILE_AUTHORITY = authority_template.format(
    tenant=b2c_tenant, user_flow=editprofile_user_flow)

B2C_RESET_PASSWORD_AUTHORITY = authority_template.format(
    tenant=b2c_tenant, user_flow=resetpassword_user_flow)

REDIRECT_PATH = "/getAToken"

# This is the API resource endpoint
ENDPOINT = '' # Application ID URI of app registration in Azure portal

# These are the scopes you've exposed in the web API app registration in the Azure portal
SCOPE = []  # Example with two exposed scopes: ["demo.read", "demo.write"]

SESSION_TYPE = "filesystem"  # Specifies the token cache should be stored in server-side session
```

Update the code above with your Azure AD B2C environment settings as explained in the [Configure the sample web app](configure-authentication-sample-python-web-app.md#step-4-configure-the-sample-web-app) section of the [Configure authentication in a sample Python web app](configure-authentication-sample-python-web-app.md) article.

## Step 5: Add the web app code

In this section, you add the Flask view functions, and the MSAL library authentication methods. Under the root folder of your project, add a file named `app.py` with the following code:

```python
import uuid
import requests
from flask import Flask, render_template, session, request, redirect, url_for
from flask_session import Session  # https://pythonhosted.org/Flask-Session
import msal
import app_config


app = Flask(__name__)
app.config.from_object(app_config)
Session(app)

# This section is needed for url_for("foo", _external=True) to automatically
# generate http scheme when this sample is running on localhost,
# and to generate https scheme when it is deployed behind reversed proxy.
# See also https://flask.palletsprojects.com/en/1.0.x/deploying/wsgi-standalone/#proxy-setups
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)


@app.route("/anonymous")
def anonymous():
    return "anonymous page"

@app.route("/")
def index():
    #if not session.get("user"):
    #    return redirect(url_for("login"))

    if not session.get("user"):
        session["flow"] = _build_auth_code_flow(scopes=app_config.SCOPE)
        return render_template('index.html', auth_url=session["flow"]["auth_uri"], version=msal.__version__)
    else:
        return render_template('index.html', user=session["user"], version=msal.__version__)

@app.route("/login")
def login():
    # Technically we could use empty list [] as scopes to do just sign in,
    # here we choose to also collect end user consent upfront
    session["flow"] = _build_auth_code_flow(scopes=app_config.SCOPE)
    return render_template("login.html", auth_url=session["flow"]["auth_uri"], version=msal.__version__)

@app.route(app_config.REDIRECT_PATH)  # Its absolute URL must match your app's redirect_uri set in AAD
def authorized():
    try:
        cache = _load_cache()
        result = _build_msal_app(cache=cache).acquire_token_by_auth_code_flow(
            session.get("flow", {}), request.args)
        if "error" in result:
            return render_template("auth_error.html", result=result)
        session["user"] = result.get("id_token_claims")
        _save_cache(cache)
    except ValueError:  # Usually caused by CSRF
        pass  # Simply ignore them
    return redirect(url_for("index"))

@app.route("/logout")
def logout():
    session.clear()  # Wipe out user and its token cache from session
    return redirect(  # Also logout from your tenant's web session
        app_config.AUTHORITY + "/oauth2/v2.0/logout" +
        "?post_logout_redirect_uri=" + url_for("index", _external=True))

@app.route("/graphcall")
def graphcall():
    token = _get_token_from_cache(app_config.SCOPE)
    if not token:
        return redirect(url_for("login"))
    graph_data = requests.get(  # Use token to call downstream service
        app_config.ENDPOINT,
        headers={'Authorization': 'Bearer ' + token['access_token']},
        ).json()
    return render_template('graph.html', result=graph_data)


def _load_cache():
    cache = msal.SerializableTokenCache()
    if session.get("token_cache"):
        cache.deserialize(session["token_cache"])
    return cache

def _save_cache(cache):
    if cache.has_state_changed:
        session["token_cache"] = cache.serialize()

def _build_msal_app(cache=None, authority=None):
    return msal.ConfidentialClientApplication(
        app_config.CLIENT_ID, authority=authority or app_config.AUTHORITY,
        client_credential=app_config.CLIENT_SECRET, token_cache=cache)

def _build_auth_code_flow(authority=None, scopes=None):
    return _build_msal_app(authority=authority).initiate_auth_code_flow(
        scopes or [],
        redirect_uri=url_for("authorized", _external=True))

def _get_token_from_cache(scope=None):
    cache = _load_cache()  # This web app maintains one cache per session
    cca = _build_msal_app(cache=cache)
    accounts = cca.get_accounts()
    if accounts:  # So all account(s) belong to the current signed-in user
        result = cca.acquire_token_silent(scope, account=accounts[0])
        _save_cache(cache)
        return result

app.jinja_env.globals.update(_build_auth_code_flow=_build_auth_code_flow)  # Used in template

if __name__ == "__main__":
    app.run()

```

## Step 6: Run your web app

In the Terminal, run the app by entering the following command, which runs the Flask development server. The development server looks for `app.py` by default. Then, open your browser and navigate to the web app URL: `http://localhost:5000`.

# [Linux](#tab/linux)

```bash
python -m flask run --host localhost --port 5000
```

# [macOS](#tab/macos)

```zsh
python -m flask run --host localhost --port 5000
```

# [Windows](#tab/windows)

```cmd
py -m flask run --host localhost --port 5000
```

---

## [Optional] Debug your app

The debugging feature gives you the opportunity to pause a running program on a particular line of code. When you pause the program, you can examine variables, run code in the Debug Console panel, and otherwise take advantage of the features described on [Debugging](https://code.visualstudio.com/docs/python/debugging). To use the Visual Studio Code debugger, check out the [VS Code documentation](https://code.visualstudio.com/docs/python/tutorial-flask#_create-multiple-templates-that-extend-a-base-template).

To change the host name and/or port number, use the `args` array of the `launch.json` file. The following example demonstrates how to configure the host name to `localhost` and port number to `5001`. Note, if you change the host name, or the port number, you must update the redirect URI or your application. For more information, check out the [Register a web application](configure-authentication-sample-python-web-app.md#step-2-register-a-web-application) step.

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Flask",
            "type": "python",
            "request": "launch",
            "module": "flask",
            "env": {
                "FLASK_APP": "app.py",
                "FLASK_ENV": "development"
            },
            "args": [
                "run",
                "--host=localhost",
                "--port=5001"
            ],
            "jinja": true,
            "justMyCode": true
        }
    ]
}
```



## Next steps

- Learn how to [customize and enhance the Azure AD B2C authentication experience for your web app](enable-authentication-python-web-app-options.md)
