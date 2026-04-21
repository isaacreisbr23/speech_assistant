import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [comando, setComando] = useState("");

    const handleCriar = async () => {
        if (!nome || !comando) {
            alert("Preencha todos os campos");
            return;
        }

        const caminho = await window.api.criarArquivo(nome, comando);
        alert("Arquivo criado em: " + caminho);

        setNome("");
        setComando("");
        setOpen(false);
    };

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
                                <Button
                                    className="w-full h-28 text-lg rounded-2xl bg-blue-500 hover:bg-blue-400 text-white flex flex-col items-center justify-center gap-2"
                                    onClick={() => setOpen(true)}
                                >
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

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white text-black rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Novo Comando</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            placeholder="Nome do comando"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <Input
                            placeholder="Comando"
                            value={comando}
                            onChange={(e) => setComando(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCriar}>
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}