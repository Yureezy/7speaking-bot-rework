const config = {
    // Line 2: Extends a popular conventional configuration base.
    extends: ["@commitlint/config-conventional"],
    rules: {
        // 1. Format: <type>([optional scope]): <description> - enforced by most rules below.
        // Enforce that the type is not empty.
        'type-empty': [2, 'never'],

        // Enforce specific commit types. Add/remove types based on the project.
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'build','tech', 'chore', 'ci', 'style', 'refactor']
        ],

        // Subject/Description Rules:
        // 2. Short and Summarized: Try to fit the subject line inside 50 characters.
        'header-max-length': [2, 'always', 50],

        // 3. Capitalize the description: Start subject line with a capital letter.
        // 'sentence-case' helps with generating changelogs.
        'subject-case': [2, 'always', 'sentence-case'],

        // 4. Avoid trailing period.
        'subject-full-stop': [2, 'never', '.'],

        // Body Rules:
        // 5. Body is added by leaving a blank line after the subject line.
        'body-leading-blank': [2, 'always'],

        // 6. Wrap the body at 72 characters.
        'body-max-line-length': [2, 'always', 72],

        // Footer Rules:
        // Ensure a blank line precedes the footer.
        'footer-leading-blank': [2, 'always'],

        // Rule for Optional Scope:
        // Enforce that if a scope is used, it is in lower-case.
        'scope-case': [2, 'always', 'lower-case'],
    }
};

export default config;