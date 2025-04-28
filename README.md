
# Personal Finance Tracker

A modern web application for managing personal finances, tracking expenses, and monitoring budgets.

# Demo : https://sensational-salamander-d4a039.netlify.app/

## Features

- 💰 **Transaction Management**: Add, edit, and delete financial transactions
- 📊 **Visual Analytics**: 
  - Pie chart showing spending distribution by category
  - Bar chart comparing budget vs. actual spending
  - Monthly expense trends
- 🏷️ **Category Management**: Organize transactions into categories (Food, Transportation, Utilities, etc.)
- 💼 **Budget Planning**: Set and track budgets for different expense categories
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Date Management**: date-fns
- **Notifications**: Sonner for toast notifications

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Usage

1. **Adding Transactions**
   - Click the "Add Transaction" button
   - Fill in the amount, category, date, and description
   - Submit the form

2. **Managing Budgets**
   - Navigate to the budget section
   - Set monthly budgets for different categories
   - View budget vs. actual spending in the charts

3. **Viewing Analytics**
   - Check the pie chart for spending distribution
   - Review the budget comparison chart
   - Monitor monthly expense trends

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)

