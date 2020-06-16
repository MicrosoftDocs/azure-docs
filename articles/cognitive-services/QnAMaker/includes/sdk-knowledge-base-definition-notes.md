* SDKs for each language may be have same functionality due to generation and production delays
* Answers use metadata, and links
* Order of QnA Pairs is specific to make the update link prompts correctly. This is something easier handled offline as a single .TSX or .XLS file.
* Filename must include extension, public URI must be for that exact file name
* only pass language to create statement if this is first kb in resource
* get endpoints and query only after publishing
* update method allows you to add, update, or delete -- all in the same call
* JS library properties - most methods and properties start with lower-case letter. If you use an uppercase letter, the library doesn't throw an error but ignores the property