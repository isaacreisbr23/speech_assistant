
import { motion } from "framer-motion";
import { Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl p-6"
      >
        <Card className="rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Painel de Comandos
            </h1>

            <p className="text-blue-100 text-center mb-8">
              Gerencie e visualize seus comandos personalizados de forma rápida e intuitiva.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="w-full h-28 text-lg rounded-2xl bg-blue-500 hover:bg-blue-400 text-white flex flex-col items-center justify-center gap-2">
                  <Plus size={28} />
                  Registrar Novo Comando
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="w-full h-28 text-lg rounded-2xl bg-blue-800 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-2">
                  <List size={28} />
                  Visualizar Comandos
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
