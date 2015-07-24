
1. In the Server Explorer in Visual Studio, expand the **Azure** node, **Mobile Services**, and your mobile service.

2. Right-click the **TodoItem** table, click **Edit Permissions**, set all permissions to **Only authenticated users**, and then click **Apply**. This ensures that all operations against the _TodoItem_ table require an authenticated user.

3. Right-click the client app project, click **Debug**, then **Start new instance**; verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

	This happens because the app attempts to access Mobile Services as an unauthenticated user, but the *TodoItem* table now requires authentication.

Next, you will update the app to authenticate users before requesting resources from the mobile service.
