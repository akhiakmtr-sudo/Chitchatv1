import React, { useState, FormEvent, useCallback } from 'react';
import { AuthState } from '../../types';

interface ResetPasswordProps {
  setAuthStage: (stage: AuthState) => void;
  onPasswordReset: (newPassword: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ setAuthStage, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { password, confirmPassword } = formData;

    // Password
    if (!password) {
      newErrors.password = 'Password is required.';
    } else {
        if (password.length < 8) newErrors.password = 'Password must be at least 8 characters long. ';
        if (!/[A-Z]/.test(password)) newErrors.password = (newErrors.password || '') + 'Requires an uppercase letter. ';
        if (!/[a-z]/.test(password)) newErrors.password = (newErrors.password || '') + 'Requires a lowercase letter. ';
        if (!/[0-9]/.test(password)) newErrors.password = (newErrors.password || '') + 'Requires a number. ';
        if (!/[!@#$%^&*]/.test(password)) newErrors.password = (newErrors.password || '') + 'Requires a special character (!@#$%^&*). ';
    }
    
    // Confirm Password
    if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
        validate();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate();
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);

    setTimeout(() => {
        setIsLoading(false);
        onPasswordReset(formData.password);
        setSuccess(true);
        setTimeout(() => {
            alert("Password has been reset successfully. Please log in with your new password.");
            setAuthStage('login');
        }, 2000);
    }, 1500);
  };

  if(success) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-green-600 dark:text-green-400 mb-6">Password Reset!</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">Your password has been successfully reset. Redirecting to login...</p>
        </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 ${touched.password && errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}`}
            required
          />
           {touched.password && errors.password && (
            <p className="text-xs text-red-500 mt-1 absolute whitespace-pre-line">{errors.password.split('. ').join('.\n')}</p>
        )}
        </div>
        <div className="relative pt-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}`}
            required
          />
          {touched.confirmPassword && errors.confirmPassword && <p className="text-red-500 text-xs mt-1 absolute">{errors.confirmPassword}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-8"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
      <div className="text-center mt-4">
        <button onClick={() => setAuthStage('login')} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;