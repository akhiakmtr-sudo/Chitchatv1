import React, { useState, FormEvent, useCallback } from 'react';
import { AuthState, User } from '../../types';

interface SignupProps {
  onRegister: (user: User) => void;
  setAuthStage: (stage: AuthState) => void;
}

const Signup: React.FC<SignupProps> = ({ onRegister, setAuthStage }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    age: '',
    gender: 'Prefer not to say',
    interest: 'Straight',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { email, username, password, age, location } = formData;

    // Username
    if (!username) newErrors.username = 'Name is required.';
    
    // Email
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.';
    }
    
    // Age
    const ageNum = parseInt(age, 10);
    if (!age) {
        newErrors.age = 'Age is required.';
    } else if (isNaN(ageNum) || ageNum < 18) {
        newErrors.age = 'You must be 18 or older.';
    }

    // Location
    if (!location) newErrors.location = 'Location is required.';

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
        validate();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({
        email: true, username: true, password: true, age: true, location: true
    });
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        age: parseInt(formData.age, 10),
        gender: formData.gender as User['gender'],
        interest: formData.interest as User['interest'],
        location: formData.location,
        avatar: `https://picsum.photos/seed/${formData.username}/100/100`,
        isOnline: false,
        isPro: false,
      };
      onRegister(newUser);
    }, 1500);
  };
  
  const InputField: React.FC<{name: string, type?: string, placeholder: string, value: string, error?: string}> = ({ name, type = 'text', placeholder, value, error }) => (
      <div className="relative">
          <input 
            name={name} 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}`}
            required 
          />
          {error && <p className="text-red-500 text-xs mt-1 absolute">{error}</p>}
      </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            <InputField name="username" placeholder="Name" value={formData.username} error={touched.username ? errors.username : ''} />
            <InputField name="email" type="email" placeholder="Email" value={formData.email} error={touched.email ? errors.email : ''} />
            <InputField name="age" type="number" placeholder="Age" value={formData.age} error={touched.age ? errors.age : ''} />
            <InputField name="location" placeholder="Location" value={formData.location} error={touched.location ? errors.location : ''} />
            <select name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
            </select>
            <select name="interest" value={formData.interest} onChange={handleChange} onBlur={handleBlur} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Straight</option><option>Bisexual</option><option>Gay</option><option>Lesbian</option><option>Cuck Fantasies</option>
            </select>
        </div>
        <InputField name="password" type="password" placeholder="Password" value={formData.password} error={touched.password ? errors.password : ''} />
         {touched.password && errors.password && (
            <p className="text-xs text-red-500 -mt-4 leading-tight whitespace-pre-line">{errors.password.split('. ').join('.\n')}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <button onClick={() => setAuthStage('login')} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
          Log in
        </button>
      </div>
    </div>
  );
};

export default Signup;
