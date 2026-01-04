/*
 * ELITE PORTFOLIO - FORM VALIDATION
 * Contact Form Validation & Submission
 */

'use strict';

// ========================================
// FORM VALIDATION
// ========================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = this.validateForm();

        if (isValid) {
            this.submitForm();
        }
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Check if empty
        if (value === '') {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required`;
        }
        // Specific validation for email
        else if (fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Minimum length for message
        else if (fieldName === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent : field.name;
    }

    showError(field, message) {
        field.classList.add('error');

        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('form-error')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }

        errorDiv.textContent = message;
        errorDiv.classList.add('visible');
    }

    clearError(field) {
        field.classList.remove('error');
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('form-error')) {
            errorDiv.classList.remove('visible');
        }
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Simulate API call (replace with actual endpoint)
            await this.sendFormData(data);

            // Show success message
            this.showSuccess();
            this.form.reset();

        } catch (error) {
            // Show error message
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async sendFormData(data) {
        // Simulate API call with timeout
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1500);
        });

        // Replace the above with actual API call:
        /*
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        return response.json();
        */
    }

    showSuccess() {
        let successDiv = document.querySelector('.form-success');

        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <h4 style="margin-bottom: 0.5rem; color: var(--accent-primary);">Message Sent Successfully!</h4>
        <p style="margin: 0; color: var(--text-secondary);">Thank you for reaching out. I'll get back to you soon.</p>
      `;
            this.form.parentNode.insertBefore(successDiv, this.form);
        }

        successDiv.classList.add('visible');
        this.form.style.display = 'none';

        // Hide success message after 5 seconds
        setTimeout(() => {
            successDiv.classList.remove('visible');
            this.form.style.display = 'block';
        }, 5000);
    }

    showErrorMessage(message) {
        alert(message); // Replace with a better UI notification
    }
}

// Initialize form validator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator('contactForm');
});

console.log('📝 Form Validation Ready');
