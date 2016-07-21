# Pull request comment automation

We use comment automation in pull request comments to allow contributors and authors to assign labels that drive the pull request review process.

| Comment | What it does | Availability|
| -------- |-------------|-------------|
|#sign-off | When the author of an article types the **#sign-off** comment in the comment stream, the **ready-to-merge** label is assigned. | Public and private|
|#sign-off | If a contributor who is NOT the listed author tries to sign off on a public pull request using the **#sign-off** comment, a message is written to the pull request indicating the label can be assigned only by the author. | Public |
|#hold-off | If you type **#hold-off** in a pull request comment, it removes the **ready-to-merge** label - in case you change your mind or make a mistake. In the private repo, this assigns the **do-not-merge** label. | Public and private |
| #please-close	| You can type the **#please-close** comment in the comment stream of a pull request to close it if you decide not to have the changes merged. | Public |



