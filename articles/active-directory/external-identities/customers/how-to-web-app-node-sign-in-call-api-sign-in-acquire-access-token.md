
for sign in and sign out, try to use content from the sign in users article (notice an access token is received if you include scopes), and store them in a session

For acquire token, use the getToken functions:

try to get token silently (use account as identifier), if it fails (no valid token for account and scopes), request an access token afresh. 

