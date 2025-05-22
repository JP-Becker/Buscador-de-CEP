"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Search, AlertCircle } from "lucide-react"

export default function Home() {
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const handleCepChange = (e) => {
    // Remove qualquer caractere que não seja número
    const value = e.target.value.replace(/\D/g, "")
    setCep(value)
  }

  const buscarCep = async () => {
    // Limpa estados anteriores
    setErro("")
    setEndereco(null)

    // Valida o CEP (deve ter 8 dígitos)
    if (cep.length !== 8) {
      setErro("CEP inválido. O CEP deve conter 8 dígitos.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      // Verifica se a API retornou algum erro
      if (data.erro) {
        setErro("CEP não encontrado.")
        setEndereco(null)
      } else {
        setEndereco(data)
        setErro("")
      }
    } catch (error) {
      setErro("Erro ao buscar o CEP. Tente novamente.")
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatarCep = (cep) => {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Consulta de Endereço por CEP
          </CardTitle>
          <CardDescription>Digite o CEP para buscar o endereço correspondente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Digite o CEP (somente números)"
              value={cep}
              onChange={handleCepChange}
              maxLength={9}
              className="flex-1"
            />
            <Button onClick={buscarCep} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Buscando...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Buscar
                </span>
              )}
            </Button>
          </div>

          {erro && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {endereco && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">CEP</p>
                  <p>{formatarCep(endereco.cep.replace("-", ""))}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Logradouro</p>
                  <p>{endereco.logradouro || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Bairro</p>
                  <p>{endereco.bairro || "-"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Cidade</p>
                  <p>{endereco.localidade || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p>{endereco.uf || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">Dados fornecidos pela API ViaCEP</CardFooter>
      </Card>
    </main>
  )
}
