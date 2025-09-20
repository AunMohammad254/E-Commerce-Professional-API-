/**
 * Email Configuration Validator
 * Validates EmailJS configuration at application startup
 */

import { emailService } from '../services/emailService';

export interface ConfigValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export const validateEmailConfiguration = async (): Promise<ConfigValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if EmailJS is configured
    if (!emailService.isConfigured()) {
        errors.push('EmailJS configuration is missing or incomplete');
        errors.push('Please check your .env file and ensure all EmailJS variables are set');
        return {
            isValid: false,
            errors,
            warnings
        };
    }

    // Test the configuration
    try {
        const testResult = await emailService.testConfiguration();
        if (!testResult.success) {
            errors.push(`EmailJS configuration test failed: ${testResult.message}`);
            return {
                isValid: false,
                errors,
                warnings
            };
        }
    } catch (error) {
        errors.push(`Failed to test EmailJS configuration: ${error}`);
        return {
            isValid: false,
            errors,
            warnings
        };
    }

    return {
        isValid: true,
        errors,
        warnings
    };
};

export const logConfigurationStatus = (result: ConfigValidationResult): void => {
    if (result.isValid) {
        console.log('✅ EmailJS configuration is valid and working');
    } else {
        console.error('❌ EmailJS configuration validation failed:');
        result.errors.forEach(error => console.error(`  - ${error}`));
    }

    if (result.warnings.length > 0) {
        console.warn('⚠️ EmailJS configuration warnings:');
        result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
};