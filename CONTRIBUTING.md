# Contributing to BrunoQuery

Thank you for your interest in contributing to BrunoQuery! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [TypeScript 2.0 Compatibility](#typescript-20-compatibility)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. By participating, you are expected to uphold this code.

### Our Pledge

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm
- Git
- TypeScript knowledge
- Docker, Docker Compose (optional)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ts-bruno-query.git
   cd ts-bruno-query
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/tranquangkhuong/ts-bruno-query.git
   ```

## Development Setup

### Installation

```bash
# Install dependencies
npm install

# Or with Makefile
make install
```

### Available Scripts

```bash
# Clean build directory
npm run clean

# Build the project
npm run build

# Build in watch mode
npm run dev

# Run tests
npm run test
```

### Project Structure

```
ts-bruno-query/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── enum.ts            # Enums (QueryOperator, SortDirection)
│   └── interface.ts       # TypeScript interfaces
├── dist/                  # Built files
├── scripts/               # Build scripts
│   └── fix-dts.js        # TypeScript 2.0 compatibility fixer
├── tests/                 # Test files
├── docs/                  # Documentation
└── package.json
```

## Making Changes

### Branch Naming

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b docs/update-readme
```

### Making Your Changes

1. **Make your changes** in the appropriate files
2. **Follow coding standards** (see below)
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure TypeScript 2.0 compatibility**

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: add support for custom filter operators"
git commit -m "fix: resolve issue with nested filter groups"
git commit -m "docs: update API documentation"

# Bad
git commit -m "fix stuff"
git commit -m "update"
```

## Testing

### Running Tests

```bash
# Run tests for object to string conversion
npm run test

# Run tests for string to object conversion
npm run test2
```

### Test Structure

- `tests/o2s.ts` - Object to String conversion tests
- `tests/s2o.ts` - String to Object parsing tests

### Adding New Tests

When adding new features, include corresponding tests:

```typescript
// Example test structure
import { BrunoQuery, QueryOperator, SortDirection } from '../src';

describe('New Feature', () => {
  it('should work correctly', () => {
    const query = new BrunoQuery();
    // Your test code here
    expect(query.toQueryString()).toBe('expected-result');
  });
});
```

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**:
   ```bash
   npm run build
   npm run test
   ```

2. **Check TypeScript 2.0 compatibility**:
   ```bash
   # The build script automatically fixes compatibility issues
   npm run build
   ```

3. **Update documentation** if your changes affect the API

4. **Rebase your branch** on the latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Submitting a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```

2. Create a Pull Request on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots if UI changes
   - List any breaking changes

3. Wait for review and address feedback

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] TypeScript 2.0 compatibility verified
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Issue Reporting

### Before Creating an Issue

1. Check existing issues and pull requests
2. Ensure you're using the latest version
3. Try to reproduce the issue

### Creating an Issue

Use the appropriate issue template and include:

- **Bug reports**: Steps to reproduce, expected vs actual behavior
- **Feature requests**: Use case and proposed solution
- **Questions**: Clear description of what you're trying to achieve

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `question` - Further information is requested
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## Coding Standards

### TypeScript

- Use **explicit types** where helpful
- Prefer **interfaces** over types for object shapes
- Use **enums** for fixed sets of values
- Follow **camelCase** for variables and functions
- Use **PascalCase** for classes and interfaces

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **trailing commas** in objects and arrays
- Use **semicolons**
- Maximum **100 characters** per line

### Example

```typescript
// Good
interface FilterOptions {
  key: string;
  value: string | number;
  operator: QueryOperator;
  not?: boolean;
}

class BrunoQuery {
  private _params: QueryParameter = {};

  public addFilter(filter: FilterOptions): this {
    // Implementation
    return this;
  }
}

// Bad
interface filterOptions {
  key:string
  value:any
  operator:any
  not:boolean
}

class brunoQuery {
  private params:any={}
  public addFilter(filter:any):any{
    return this
  }
}
```

## TypeScript 2.0 Compatibility

### Important Notes

- **Always maintain TypeScript 2.0 compatibility**
- **Never use `type` keyword in export statements** in source code
- **The build script automatically fixes** declaration files
- **Test with older TypeScript versions** when possible

### Compatibility Checklist

- [ ] No `type` keyword in export statements
- [ ] No TypeScript 3.8+ specific syntax
- [ ] All interfaces properly exported
- [ ] Build script runs successfully
- [ ] Declaration files are properly generated

### Testing Compatibility

```bash
# Test with different TypeScript versions
npx tsc --version
npm run build
# Check dist/index.d.ts and dist/index.d.mts files
```

## Release Process

### Version Bumping

- **Patch** (1.0.0 → 1.0.1): Bug fixes, documentation updates
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] TypeScript 2.0 compatibility verified
- [ ] Build successful

## Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Email**: Contact maintainers directly for sensitive issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to BrunoQuery! 🎉
