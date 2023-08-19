class Category:

    def __init__(self, category): 
        self.book = []
        self.cant = 0
        self.category = category 

    def check_funds(self, cant):
        if self.cant < cant:
            return False
        else:
            return True

    def deposit(self, cant, description=""):
        self.book.append({"amount":cant, "description":description})
        self.cant += cant

    def withdraw(self,cant,description=""):
        if self.check_funds(cant) == True:
            self.cant -= cant
            self.book.append({"amount":-cant, "description":description})
            return True
        else:
            return False

    def get_balance(self):
        return self.cant

    def __str__(self):
        result = ""
        result += "*************Food*************"+"\n"
        for transaction in self.book:
            cant = 0
            description = ""
            for key,value in transaction.items():
                if key == "amount":
                    cant = value
                elif key == "description":
                    description = value
            if len(description)>23:
                description = description[:23]
            cant = str(format(float(cant),'.2f'))
            if len(cant) > 7:
                cant = cant[:7] 
            result += description + str(cant).rjust(30-len(description))+"\n"
        result +="Total: " + str(format(float(self.cant),'.2f'))
        return result

    def transfer(self,cant,category):
        if self.check_funds(cant) == True:
            self.cant -= cant
            self.book.append({"amount": -cant,"description":"Transfer to " + category.category})
            category.book.append({"amount": cant,"description": "Transfer from " + self.category})
            return True
        else:
            return False

    def create_spend_chart(categories):
        return "------------------------------"